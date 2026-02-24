import React, { useEffect, useState } from "react";
import { T_AVATAR } from "./types";
import { Image } from "expo-image";
import ButtonWrapper from "../buttonWrapper";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { styles } from "./styles";
import { AddCircle, Edit } from "iconsax-react-native";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { showSnackbar } from "@/utils/essentials";
import { Feather } from "@expo/vector-icons";
import { useUnistyles } from "react-native-unistyles";

const Avatar: React.FC<T_AVATAR> = ({ size, editable, type }) => {
  const { isLoaded, user } = useUser();
  const { theme } = useUnistyles();
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user && user.hasImage) setImage(user.imageUrl);
  }, [user]);

  const selectImage = async () => {
    try {
      setLoading(true);
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: false,
        base64: true,
      });

      if (!result.canceled) {
        if (user && isLoaded) {
          const fileString = `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`;

          await user.setProfileImage({
            file: fileString,
          });
          await user.reload();
          showSnackbar(`Profile picture is updated.`);
        }
        setImage(result.assets[0].uri);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showSnackbar(`Something went wrong. Please try again ${error}`, `error`);
    }
  };

  return (
    <ButtonWrapper
      onPress={selectImage}
      otherProps={{
        disabled: !editable,
        style: {
          width: size ?? 75,
          height: size ?? 75,
          borderRadius: size ?? 75,
        },
      }}
    >
      {loading && (
        <ActivityIndicator
          size={"small"}
          color={theme.colors.semantic.content.contentPrimary}
          style={styles.loader}
        />
      )}
      {image ? (
        <Image
          source={{ uri: image }}
          contentFit="cover"
          contentPosition={"center"}
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: size ?? 75,
          }}
        />
      ) : (
        <View
          style={[
            styles.uploadContainer,
            {
              borderRadius: size ?? 75,
            },
          ]}
        >
          <Feather
            name="user"
            size={24}
            color={theme.colors.semantic.content.contentSecondary}
          />
        </View>
      )}
      {editable && (
        <View style={styles.editIconContainer}>
          {type == "add" ? (
            <AddCircle
              size={16}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ) : (
            <Edit
              size={16}
              color={theme.colors.semantic.content.contentPrimary}
            />
          )}
        </View>
      )}
    </ButtonWrapper>
  );
};

export default Avatar;
