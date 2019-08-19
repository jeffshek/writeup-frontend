import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

const PolicyText =
  "Senrigan Privacy Policy\n" +
  "\n" +
  "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from https://writeup.ai (the “Site”).\n" +
  "\n" +
  "PERSONAL INFORMATION WE COLLECT\n" +
  "\n" +
  "When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”\n" +
  "\n" +
  "We collect Device Information using the following technologies:\n" +
  "    \n" +
  "    - “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.\n" +
  "    - “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.\n" +
  "\n" +
  "When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.\n" +
  "\n" +
  "HOW DO WE USE YOUR PERSONAL INFORMATION?\n" +
  "\n" +
  "Communicate with you;\n" +
  "When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.\n" +
  "\n" +
  "SHARING YOUR PERSONAL INFORMATION\n" +
  "\n" +
  "We use Google Analytics to help us understand how our customers use the Site--you can read more about how Google uses your Personal Information here:  https://www.google.com/intl/en/policies/privacy/.  You can also opt-out of Google Analytics here:  https://tools.google.com/dlpage/gaoptout.\n" +
  "\n" +
  "Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.\n" +
  "\n" +
  "Additionally, you can opt out of some of these services by visiting the Digital Advertising Alliance’s opt-out portal at:  http://optout.aboutads.info/.\n" +
  "\n" +
  "DO NOT TRACK\n" +
  "Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.\n" +
  "\n" +
  "CHANGES\n" +
  "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.\n" +
  "\n" +
  "CONTACT US\n" +
  "For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at jeff@senrigan.io or by mail using the details provided below:\n" +
  "\n" +
  "  99 St Marks Place, 3D, New York, NY, 10009, United States";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    //background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    padding: 50
  }
}));

export const PrivacyPolicyComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography style={{ whiteSpace: "pre-line" }}>{PolicyText}</Typography>
    </div>
  );
};
