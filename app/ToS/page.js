"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: August 06, 2025
            </p>
          </div>

          <div className="space-y-8 text-gray-800 dark:text-gray-200">
            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Agreement to Our Legal Terms
              </h2>
              <p className="mb-4">
                We are Deforge ("Company," "we," "us," "our"), a company registered in India. 
                We operate the website https://deforge.io (the "Site"), the Deforge application, 
                and any other related products and services that refer or link to these legal terms 
                (the "Legal Terms") (collectively, the "Services").
              </p>
              <p className="mb-4">
                Deforge is a node-based visual editor for creating and deploying AI agents.
              </p>
              <p className="mb-4">
                You can contact us by email at support@deforge.io or by mail to Barrackpore, 
                Kolkata, West Bengal 700120, India.
              </p>
              <p className="mb-4">
                These Legal Terms constitute a legally binding agreement made between you, whether 
                personally or on behalf of an entity ("you"), and Deforge, concerning your access 
                to and use of the Services. You agree that by accessing the Services, you have read, 
                understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE 
                WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE 
                SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Our Services
              </h2>
              <p className="mb-4">
                The information provided when using the Services is not intended for distribution 
                to or use by any person or entity in any jurisdiction or country where such 
                distribution or use would be contrary to law or regulation or which would subject 
                us to any registration requirement within such jurisdiction or country.
              </p>
              <p className="mb-4">
                Accordingly, those persons who choose to access the Services from other locations 
                do so on their own initiative and are solely responsible for compliance with local 
                laws, if and to the extent local laws are applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Intellectual Property Rights
              </h2>
              <p className="mb-4">
                We are the owner or the licensee of all intellectual property rights in our Services, 
                including all source code, databases, functionality, software, website designs, audio, 
                video, text, photographs, and graphics in the Services (collectively, the "Content"), 
                as well as the trademarks, service marks, and logos contained therein (the "Marks").
              </p>
              <p className="mb-4">
                Our Content and Marks are protected by copyright and trademark laws (and various other 
                intellectual property rights and unfair competition laws) and treaties in the United 
                States and around the world.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                User Representations
              </h2>
              <p className="mb-4">By using the Services, you represent and warrant that:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary</li>
                <li>You have the legal capacity and you agree to comply with these Legal Terms</li>
                <li>You are not a minor in the jurisdiction in which you reside</li>
                <li>You will not access the Services through automated or non-human means</li>
                <li>You will not use the Services for any illegal or unauthorized purpose</li>
                <li>Your use of the Services will not violate any applicable law or regulation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Prohibited Activities
              </h2>
              <p className="mb-4">
                You may not access or use the Services for any purpose other than that for which 
                we make the Services available. The Services may not be used in connection with 
                any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
              <p className="mb-4">As a user of the Services, you agree not to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Systematically retrieve data or other content from the Services to create or compile a database or directory</li>
                <li>Trick, defraud, or mislead us and other users</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the Services</li>
                <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services</li>
                <li>Use any information obtained from the Services in order to harass, abuse, or harm another person</li>
                <li>Make improper use of our support services or submit false reports of abuse or misconduct</li>
                <li>Use the Services in a manner inconsistent with any applicable laws or regulations</li>
                <li>Engage in unauthorized framing of or linking to the Services</li>
                <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use of the Services</li>
                <li>Engage in any automated use of the system</li>
                <li>Delete the copyright or other proprietary rights notice from any Content</li>
                <li>Attempt to impersonate another user or person or use the username of another user</li>
                <li>Upload or transmit any material that acts as a passive or active information collection or transmission mechanism</li>
                <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services</li>
                <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you</li>
                <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services</li>
                <li>Copy or adapt the Services' software</li>
                <li>Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services</li>
                <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system</li>
                <li>Use a buying agent or purchasing agent to make purchases on the Services</li>
                <li>Make any unauthorized use of the Services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Termination
              </h2>
              <p className="mb-4">
                We may terminate or suspend your account and bar access to the Services immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="mb-4">
                If you wish to terminate your account, you may simply discontinue using the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Disclaimer
              </h2>
              <p className="mb-4">
                THE INFORMATION ON THIS WEBSITE IS PROVIDED ON AN "AS IS" BASIS. TO THE FULLEST 
                EXTENT PERMITTED BY LAW, THIS COMPANY EXCLUDES ALL REPRESENTATIONS, WARRANTIES, 
                CONDITIONS AND TERMS (EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE) OTHER THAN THOSE 
                EXPRESSLY SET OUT IN THE TERMS AND CONDITIONS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Limitation of Liability
              </h2>
              <p className="mb-4">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL DEFORGE, ITS 
                AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR 
                ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE 
                DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING 
                FROM YOUR USE OF THE SERVICES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Governing Law
              </h2>
              <p className="mb-4">
                These Legal Terms shall be interpreted and construed in accordance with the laws of 
                India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Changes to Terms
              </h2>
              <p className="mb-4">
                We reserve the right, in our sole discretion, to make changes or modifications to 
                these Legal Terms from time to time. We will alert you about any changes by updating 
                the "Last updated" date of these Legal Terms, and you waive any right to receive 
                specific notice of each such change.
              </p>
              <p className="mb-4">
                It is your responsibility to periodically review these Legal Terms to stay informed 
                of updates. You will be subject to, and will be deemed to have been made aware of 
                and to have accepted, the changes in any revised Legal Terms by your continued use 
                of the Services after the date such revised Legal Terms are posted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-background mb-4">
                Contact Information
              </h2>
              <p className="mb-4">
                In order to resolve a complaint regarding the Services or to receive further 
                information regarding use of the Services, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="mb-2"><strong>Deforge</strong></p>
                <p className="mb-2">Barrackpore</p>
                <p className="mb-2">Kolkata, West Bengal 700120</p>
                <p className="mb-2">India</p>
                <p>Email: support@deforge.io</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
