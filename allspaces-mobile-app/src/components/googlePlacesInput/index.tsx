import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import GooglePlacesSDK from 'react-native-google-places-sdk';
import { envConfig } from '@/utils/envConfig';
import { T_GOOGLE_PLACES_INPUT } from './types';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetGooglePlaceData } from '@/redux/app.slice';
import { RootState } from '@/redux/store';
import { useUnistyles } from 'react-native-unistyles';
import { Location, CloseCircle } from 'iconsax-react-native';
import AppText from '../appText';
import { T_GEO_RESULT } from '@/apis/types';
import { useGetGeocode } from '@/apis/google/google.api';

interface PlacePrediction {
  placeID: string;
  description: string;
}

const GooglePlacesInput: React.FC<T_GOOGLE_PLACES_INPUT> = ({
  placeholder,
  label,
  maxSuggestions = 5,
  minSearchLength = 2,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { googlePlaceData } = useSelector((state: RootState) => state.appSlice);
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { mutateAsync: geocodingAPI, isPending } = useGetGeocode();

  useEffect(() => {
    // Initialize the Google Places SDK
    GooglePlacesSDK.initialize(envConfig.EXPO_PUBLIC_GOOGLE_KEY);
  }, []);

  useEffect(() => {
    // Update query when googlePlaceData changes (for initial load or external updates)
    if (googlePlaceData?.formatted_address) {
      setQuery(googlePlaceData.formatted_address);
    }
  }, [googlePlaceData]);

  const fetchPredictions = async (input: string) => {
    if (input.length >= minSearchLength) {
      try {
        const results = await GooglePlacesSDK.fetchPredictions(input);
        setPredictions(results.slice(0, maxSuggestions));
        setShowSuggestions(true);
      } catch (error) {
        setPredictions([]);
      }
    } else {
      setPredictions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPlace = async (place: PlacePrediction) => {
    setQuery(place.description);
    setPredictions([]);
    setShowSuggestions(false);

    // Fetch full place details using geocoding API to get lat/lng
    try {
      const geocodeResult = await geocodingAPI(place.description);
      if (geocodeResult?.results && geocodeResult.results.length > 0) {
        const result = geocodeResult.results[0];
        
        // Transform to match T_GEO_RESULT structure
        const transformedData: T_GEO_RESULT = {
          ...result,
          structured_formatting: {
            main_text: place.description.split(',')[0].trim(),
            secondary_text: place.description.split(',').slice(1).join(',').trim()
          }
        };
        
        dispatch(actionSetGooglePlaceData(transformedData));
      }
    } catch (error) {
      // Silently handle error
    }
  };

  const handleClear = () => {
    setQuery('');
    setPredictions([]);
    setShowSuggestions(false);
    dispatch(actionSetGooglePlaceData(null));
  };

  return (
    <View style={styles.mainContainer}>
      {label && (
        <View style={styles.labelContainer}>
          <AppText font="button1">{label}</AppText>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <Location
          size={24}
          color={theme.colors.semantic.content.contentPrimary}
        />
        
        <TextInput
          placeholder={placeholder ?? "Search Location"}
          placeholderTextColor={theme.colors.semantic.content.contentInverseTertionary}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            fetchPredictions(text);
          }}
          autoCapitalize="none"
          style={styles.textInput}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          onFocus={() => {
            if (query.length >= minSearchLength && predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        
        {isPending ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.semanticExtensions.content.contentAccent}
          />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={handleClear}>
            <CloseCircle
              size={24}
              color={theme.colors.semantic.content.contentInverseTertionary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {showSuggestions && predictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={styles.suggestionsScrollView}
          >
            {predictions.map((item, index) => (
              <TouchableOpacity
                key={item.placeID}
                onPress={() => handleSelectPlace(item)}
                activeOpacity={0.7}
                style={[
                  styles.suggestionItem,
                  index === predictions.length - 1 && styles.lastSuggestionItem
                ]}
              >
                <Location
                  size={20}
                  color={theme.colors.semantic.content.contentInverseTertionary}
                />
                <AppText 
                  font="body2" 
                  style={styles.suggestionText}
                  textProps={{ numberOfLines: 1 }}
                >
                  {item.description}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default GooglePlacesInput;
