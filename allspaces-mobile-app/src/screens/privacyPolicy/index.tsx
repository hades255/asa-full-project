import { ScrollView } from "react-native";
import React from "react";
import { T_PRIVACY_POLICY_SCREEN } from "./types";
import { AppText, Header2, ScreenWrapper } from "@/components";
import { styles } from "./styles";

const PrivacyScreen: React.FC<T_PRIVACY_POLICY_SCREEN> = ({ navigation }) => {
  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Privacy Policy" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <AppText font="body1">
          Your privacy is important to us. This Privacy Policy outlines how we
          collect, use, and protect your personal information when you use our
          hotel management services. By accessing our services, you consent to
          the practices described in this document.
          {"\n\n"}
          We collect information that you provide directly, such as when you
          create an account, make a reservation, or contact customer support.
          This may include your name, email address, phone number, billing
          information, and any other details you choose to share. We also
          collect information automatically, such as IP addresses, browser
          types, device identifiers, and usage patterns.
          {"\n\n"}
          The information we collect is used to provide and improve our
          services, process transactions, communicate with you, personalize your
          experience, and comply with legal obligations. We may also use your
          information to send you marketing communications, which you can opt
          out of at any time.
          {"\n\n"}
          We implement a variety of security measures to maintain the safety of
          your personal information. These measures include secure servers,
          encryption, access control protocols, and regular security audits.
          However, no system can guarantee 100% security, and we encourage you
          to take precautions when sharing personal information online.
          {"\n\n"}
          We do not sell, trade, or rent your personal information to third
          parties. Information may be shared with trusted partners who assist us
          in providing services, provided they agree to keep your information
          confidential. We may also disclose your information when required by
          law or to protect our legal rights.
          {"\n\n"}
          Cookies and similar technologies are used to enhance your experience
          on our platform. Cookies allow us to recognize your browser, store
          your preferences, and analyze usage patterns. You can choose to
          disable cookies through your browser settings, but doing so may affect
          the functionality of our services.
          {"\n\n"}
          Our services may contain links to third-party websites. We are not
          responsible for the privacy practices or content of these external
          sites. We encourage you to read the privacy policies of any
          third-party websites you visit.
          {"\n\n"}
          Our services are not intended for individuals under the age of 18. We
          do not knowingly collect personal information from children. If we
          become aware that a child has provided personal information, we will
          take steps to delete such information promptly.
          {"\n\n"}
          We reserve the right to update this Privacy Policy at any time. Any
          changes will be effective immediately upon posting. Your continued use
          of our services following the posting of an updated policy constitutes
          your acceptance of the changes.
          {"\n\n"}
          If you have any questions, concerns, or requests regarding your
          personal information or this Privacy Policy, please contact our
          support team. We are committed to addressing your concerns promptly
          and respectfully.
          {"\n\n"}
          By using our hotel management services, you acknowledge that you have
          read and understood this Privacy Policy. Thank you for trusting us
          with your personal information and for being part of our community.
        </AppText>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PrivacyScreen;
