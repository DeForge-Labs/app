"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-black/50 bg-background dark:bg-dark dark:border-background">
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4 dark:text-background" />
              <span className="text-sm dark:text-background">Back</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logo-black.svg"
                alt="Logo"
                width={22}
                height={22}
                className="dark:invert"
              />
              <span className="font-bold text-2xl dark:text-background">
                Deforge
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black dark:text-background mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: August 06, 2025
            </p>
          </div>

          <div className="space-y-8 text-gray-800 dark:text-gray-200">
            <section>
              <p className="mb-4">
                This Privacy Notice for Deforge ("we," "us," or "our") describes how and why we might 
                access, collect, store, use, and/or share ("process") your personal information when 
                you use our services ("Services"), including when you:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  Visit our website at{" "}
                  <a href="https://deforge.io" className="text-blue-600 hover:underline dark:text-blue-400">
                    https://deforge.io
                  </a>{" "}
                  or any website of ours that links to this Privacy Notice
                </li>
                <li>Use Deforge. A node based visual editor for creating and deploying AI agents.</li>
                <li>Engage with us in other related ways, including any sales, marketing, or events</li>
              </ul>
              <p className="mb-4">
                <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your 
                privacy rights and choices. We are responsible for making decisions about how your personal 
                information is processed. If you do not agree with our policies and practices, please do not 
                use our Services. If you still have any questions or concerns, please contact us at 
                support@deforge.io.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Summary of Key Points
              </h2>
              <p className="mb-4">
                <em>
                  This summary provides key points from our Privacy Notice, but you can find out more 
                  details about any of these topics by clicking the link following each key point or 
                  by using our table of contents below to find the section you are looking for.
                </em>
              </p>
              
              <div className="space-y-4">
                <div>
                  <strong>What personal information do we process?</strong> When you visit, use, or navigate 
                  our Services, we may process personal information depending on how you interact with us 
                  and the Services, the choices you make, and the products and features you use.
                </div>
                
                <div>
                  <strong>Do we process any sensitive personal information?</strong> Some of the information 
                  may be considered "special" or "sensitive" in certain jurisdictions, for example your 
                  racial or ethnic origins, sexual orientation, and religious beliefs. We do not process 
                  sensitive personal information.
                </div>
                
                <div>
                  <strong>Do we collect any information from third parties?</strong> We do not collect any 
                  information from third parties.
                </div>
                
                <div>
                  <strong>How do we process your information?</strong> We process your information to provide, 
                  improve, and administer our Services, communicate with you, for security and fraud prevention, 
                  and to comply with law. We may also process your information for other purposes with your consent.
                </div>
                
                <div>
                  <strong>How do we keep your information safe?</strong> We have adequate organizational and 
                  technical processes and procedures in place to protect your personal information. However, 
                  no electronic transmission over the internet or information storage technology can be guaranteed 
                  to be 100% secure.
                </div>
                
                <div>
                  <strong>What are your rights?</strong> Depending on where you are located geographically, 
                  the applicable privacy law may mean you have certain rights regarding your personal information.
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Table of Contents
              </h2>
              <ol className="list-decimal pl-6 space-y-1">
                <li>What Information Do We Collect?</li>
                <li>How Do We Process Your Information?</li>
                <li>What Legal Bases Do We Rely On To Process Your Personal Information?</li>
                <li>When and With Whom Do We Share Your Personal Information?</li>
                <li>Do We Offer Artificial Intelligence-Based Products?</li>
                <li>How Long Do We Keep Your Information?</li>
                <li>How Do We Keep Your Information Safe?</li>
                <li>Do We Collect Information From Minors?</li>
                <li>What Are Your Privacy Rights?</li>
                <li>Controls For Do-Not-Track Features</li>
                <li>Do United States Residents Have Specific Privacy Rights?</li>
                <li>Do We Make Updates To This Notice?</li>
                <li>How Can You Contact Us About This Notice?</li>
                <li>How Can You Review, Update, Or Delete The Data We Collect From You?</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                1. What Information Do We Collect?
              </h2>
              
              <h3 className="text-lg font-semibold text-black dark:text-background mb-3">
                Personal information you disclose to us
              </h3>
              <p className="mb-4">
                <em><strong>In Short:</strong> We collect personal information that you provide to us.</em>
              </p>
              <p className="mb-4">
                We collect personal information that you voluntarily provide to us when you register on the 
                Services, express an interest in obtaining information about us or our products and Services, 
                when you participate in activities on the Services, or otherwise when you contact us.
              </p>
              
              <p className="mb-4">
                <strong>Personal Information Provided by You.</strong> The personal information that we collect 
                depends on the context of your interactions with us and the Services, the choices you make, 
                and the products and features you use. The personal information we collect may include the following:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>email addresses</li>
                <li>usernames</li>
              </ul>
              
              <p className="mb-4">
                <strong>Sensitive Information.</strong> We do not process sensitive information.
              </p>
              
              <p className="mb-4">
                <strong>Payment Data.</strong> We may collect data necessary to process your payment if you 
                choose to make purchases, such as your payment instrument number, and the security code 
                associated with your payment instrument. All payment data is handled and stored by Paddle 
                and Paypal. You may find their privacy notice links here:{" "}
                <a href="https://www.paddle.com/legal/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                  https://www.paddle.com/legal/privacy
                </a>{" "}
                and{" "}
                <a href="https://www.paypal.com/us/legalhub/paypal/privacy-full" className="text-blue-600 hover:underline dark:text-blue-400">
                  https://www.paypal.com/us/legalhub/paypal/privacy-full
                </a>
              </p>
              
              <h3 className="text-lg font-semibold text-black dark:text-background mb-3">
                Google API
              </h3>
              <p className="mb-4">
                Our use of information received from Google APIs will adhere to{" "}
                <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline dark:text-blue-400">
                  Google API Services User Data Policy
                </a>
                , including the{" "}
                <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" className="text-blue-600 hover:underline dark:text-blue-400">
                  Limited Use requirements
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                2. How Do We Process Your Information?
              </h2>
              <p className="mb-4">
                <em>
                  <strong>In Short:</strong> We process your information to provide, improve, and administer 
                  our Services, communicate with you, for security and fraud prevention, and to comply with law. 
                  We may also process your information for other purposes with your consent.
                </em>
              </p>
              <p className="mb-4">
                <strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We 
                  may process your information so you can create and log in to your account, as well as keep your 
                  account in working order.
                </li>
                <li>
                  <strong>To save or protect an individual's vital interest.</strong> We may process your information 
                  when necessary to save or protect an individual's vital interest, such as to prevent harm.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                5. Do We Offer Artificial Intelligence-Based Products?
              </h2>
              <p className="mb-4">
                <em>
                  <strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence, 
                  machine learning, or similar technologies.
                </em>
              </p>
              <p className="mb-4">
                As part of our Services, we offer products, features, or tools powered by artificial intelligence, 
                machine learning, or similar technologies (collectively, "AI Products"). These tools are designed 
                to enhance your experience and provide you with innovative solutions.
              </p>
              
              <h3 className="text-lg font-semibold text-black dark:text-background mb-3">
                Use of AI Technologies
              </h3>
              <p className="mb-4">
                We provide the AI Products through third-party service providers ("AI Service Providers"), 
                including Anthropic, ElevenLabs, Google Cloud AI and OpenAI. As outlined in this Privacy Notice, 
                your input, output, and personal information will be shared with and processed by these AI Service 
                Providers to enable your use of our AI Products.
              </p>
              
              <h3 className="text-lg font-semibold text-black dark:text-background mb-3">
                Our AI Products
              </h3>
              <p className="mb-4">Our AI Products are designed for the following functions:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>AI automation</li>
                <li>AI bots</li>
                <li>AI search</li>
                <li>AI translation</li>
                <li>Image generation</li>
                <li>Video generation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                8. Do We Collect Information From Minors?
              </h2>
              <p className="mb-4">
                <em>
                  <strong>In Short:</strong> We do not knowingly collect data from or market to children under 
                  18 years of age or the equivalent age as specified by law in your jurisdiction.
                </em>
              </p>
              <p className="mb-4">
                We do not knowingly collect, solicit data from, or market to children under 18 years of age 
                or the equivalent age as specified by law in your jurisdiction, nor do we knowingly sell such 
                personal information. By using the Services, you represent that you are at least 18 or the 
                equivalent age as specified by law in your jurisdiction or that you are the parent or guardian 
                of such a minor and consent to such minor dependent's use of the Services.
              </p>
              <p className="mb-4">
                If we learn that personal information from users less than 18 years of age has been collected, 
                we will deactivate the account and take reasonable measures to promptly delete such data from 
                our records. If you become aware of any data we may have collected from children under age 18, 
                please contact us at support@deforge.io.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                9. What Are Your Privacy Rights?
              </h2>
              <p className="mb-4">
                <em>
                  <strong>In Short:</strong> Depending on your state of residence in the US or in some regions, 
                  such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you 
                  have rights that allow you greater access to and control over your personal information. You 
                  may review, change, or terminate your account at any time, depending on your country, province, 
                  or state of residence.
                </em>
              </p>
              <p className="mb-4">
                In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under 
                applicable data protection laws. These may include the right (i) to request access and obtain 
                a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict 
                the processing of your personal information; (iv) if applicable, to data portability; and (v) 
                not to be subject to automated decision-making.
              </p>
              
              <h3 className="text-lg font-semibold text-black dark:text-background mb-3">
                Account Information
              </h3>
              <p className="mb-4">
                If you would at any time like to review or change the information in your account or terminate 
                your account, you can:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Log in to your account settings and update your user account.</li>
              </ul>
              <p className="mb-4">
                Upon your request to terminate your account, we will deactivate or delete your account and 
                information from our active databases. However, we may retain some information in our files 
                to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal 
                terms and/or comply with applicable legal requirements.
              </p>
              <p className="mb-4">
                If you have questions or comments about your privacy rights, you may email us at support@deforge.io.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                12. Do We Make Updates To This Notice?
              </h2>
              <p className="mb-4">
                <em><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
              </p>
              <p className="mb-4">
                We may update this Privacy Notice from time to time. The updated version will be indicated by 
                an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this 
                Privacy Notice, we may notify you either by prominently posting a notice of such changes or by 
                directly sending you a notification. We encourage you to review this Privacy Notice frequently 
                to be informed of how we are protecting your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                13. How Can You Contact Us About This Notice?
              </h2>
              <p className="mb-4">
                If you have questions or comments about this notice, you may email us at support@deforge.io 
                or contact us by post at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="mb-2"><strong>Deforge</strong></p>
                <p className="mb-2">Barrackpore</p>
                <p className="mb-2">Kolkata, West Bengal 700120</p>
                <p className="mb-2">India</p>
                <p>Email: support@deforge.io</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                14. How Can You Review, Update, Or Delete The Data We Collect From You?
              </h2>
              <p className="mb-4">
                Based on the applicable laws of your country or state of residence in the US, you may have the 
                right to request access to the personal information we collect from you, details about how we 
                have processed it, correct inaccuracies, or delete your personal information. You may also have 
                the right to withdraw your consent to our processing of your personal information.
              </p>
              <p className="mb-4">
                To request to review, update, or delete your personal information, please fill out and submit a{" "}
                <a href="https://app.termly.io/notify/594102fa-34dc-4b6d-b60d-3404e2c81829" className="text-blue-600 hover:underline dark:text-blue-400">
                  data subject access request
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
