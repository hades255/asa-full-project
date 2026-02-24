import { ScrollView } from "react-native";
import React from "react";
import { T_TERMS_CONDITIONS_SCREEN } from "./types";
import { AppText, Header2, ScreenWrapper } from "@/components";
import { styles } from "./styles";

const TermsConditions: React.FC<T_TERMS_CONDITIONS_SCREEN> = ({
  navigation,
}) => {
  return (
    <ScreenWrapper>
      <Header2 title="Terms & Conditions" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <AppText font="body1">
          Welcome to our Hotel Management Services. By accessing and utilizing
          our services, you agree to abide by these Terms and Conditions. Our
          hotel management platform offers property management services, online
          reservations, promotions, and hotel marketing solutions. These
          services are subject to the terms outlined here, and continued use of
          our services constitutes acceptance of these rules.
          {"\n\n"}
          All users must provide accurate and up-to-date information when
          registering or utilizing any of our services. Any misuse of
          information, fraudulent representation, or submission of false
          credentials will result in termination of services without prior
          notice. We reserve the right to verify all information submitted and
          to refuse service at our discretion.
          {"\n\n"}
          Hotel owners and managers must ensure that their properties meet local
          and national regulations regarding health, safety, and licensing. Any
          violation of these regulations is the sole responsibility of the
          property owner. We do not accept any liability arising from
          non-compliance with applicable laws or ordinances.
          {"\n\n"}
          Pricing and availability of hotel services listed on our platform are
          the responsibility of the hotel management. Any discrepancies,
          inaccuracies, or misrepresentations related to pricing, promotions,
          and availability must be rectified by the hotel within a reasonable
          time frame. We are not liable for guest dissatisfaction arising from
          such discrepancies.
          {"\n\n"}
          Guests making reservations through our platform agree to the terms set
          by the individual hotel properties. Payment processing, cancellation
          policies, and refund processes are governed by the property’s
          individual rules. We strongly encourage guests to review these terms
          before confirming a booking.
          {"\n\n"}
          Our platform may offer promotional materials, discounts, and loyalty
          programs. These promotions are subject to specific conditions which
          will be clearly stated. Misuse or fraudulent activity related to these
          programs may result in disqualification from current or future
          promotions and legal action where appropriate.
          {"\n\n"}
          Users of our platform are prohibited from uploading or sharing
          harmful, defamatory, obscene, or otherwise objectionable content. We
          reserve the right to remove any content and suspend or terminate user
          accounts without prior notice if content guidelines are violated.
          {"\n\n"}
          We prioritize the privacy of our users. Any personal information
          collected will be handled according to our Privacy Policy. However,
          users acknowledge that no internet transmission is entirely secure and
          agree that we are not liable for any unauthorized access beyond our
          reasonable control.
          {"\n\n"}
          All content, trademarks, logos, and intellectual property associated
          with our platform are owned by us or licensed appropriately.
          Unauthorized use, reproduction, or distribution is strictly prohibited
          and may result in legal action.
          {"\n\n"}
          We may update these Terms and Conditions from time to time. Changes
          will be effective immediately upon posting. Continued use of our
          services following any such updates constitutes acceptance of the new
          terms. We encourage users to periodically review this section.
          {"\n\n"}
          In case of disputes or claims arising out of or related to the use of
          our services, both parties agree to attempt to resolve the issue
          amicably. If resolution cannot be achieved, disputes will be settled
          through arbitration under applicable law.
          {"\n\n"}
          By using our hotel management services, you acknowledge that you have
          read, understood, and agreed to these Terms and Conditions. If you do
          not agree with any part of these terms, you should discontinue use of
          our services immediately. Thank you for trusting us with your
          hospitality needs.
        </AppText>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default TermsConditions;
