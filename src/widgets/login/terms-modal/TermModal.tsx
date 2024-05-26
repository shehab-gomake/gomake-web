import React, { useState, useEffect, useRef } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { Stack, Checkbox, FormControlLabel } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";

import { useGomakeAxios, useGomakeRouter } from "@/hooks";

const TermModal = ({ open, onClose, setIsTermsAccepted }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAcceptButtonEnabled, setIsAcceptButtonEnabled] = useState(false);
  const contentRef = useRef(null);

  const handleAcceptTerms = async () => {
    try {
      await callApi("POST", "/v1/crm-service/update-terms-accepted");
      setIsTermsAccepted(true);
      navigate("/");
    } catch (error) {
      console.error("Failed to accept terms", error);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setIsScrolledToBottom(true);
      }
    }
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      setIsAcceptButtonEnabled(isChecked);
    }
  }, [isScrolledToBottom, isChecked]);

  return (
    <GoMakeModal openModal={open} modalTitle={"Terms and Conditions"} onClose={onClose} insideStyle={classes.insideStyle}>
      <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} height={"100%"}>
        <div ref={contentRef} onScroll={handleScroll} style={{ overflowY: "auto", maxHeight: "200px", padding: "10px" }}>
          {t("Terms and conditions.")}SUBSCRIPTION AGREEMENT 1. GENERAL 1.1 This Agreement, together with any accepted Service
          Order between Customer and GoMake, comprise the Agreement between GoMake and the Customer and governs Customer’s use of
          the GoMake System (as defined below). GoMake shall make the GoMake System available to You as a Subscription in
          accordance with the applicable Order. The Fees (defined in Section 8) cover the use of the GoMake System (in accordance
          with the license granted herein) and the provision of any Support Services by GoMake, as further described in this
          Agreement. These Terms do not apply in respect of any additional services such as any integration, customization,
          parametrization and/or adaption services related to the GoMake System (as applicable). 1.2 By signing or electronically
          approving an Order offered by GoMake, which references this Agreement or by indicating Customer’s acceptance through an
          “I accept” button or similar electronic acceptance method available on the GoMake System, GoMake accepts the Order and
          agree to be bound by this Agreement. 2. Definitions The “Gomake System” – means GoMake’s innovative, cloud-based
          software solution designed to optimize and streamline the print business workflow at print businesses, by automating and
          facilitating the supply and order process between print businesses and their clients. “Service Orders”
          ____________________________[TBD]. 1. SUBSCRIPTION RIGHTS 1.1 GoMake hereby grants Customer, solely to the extent
          described in an applicable Order, a subscription to access that portion of the GoMake System described in the Order and
          the Subscription Service as well as all related Documentation described therein (if applicable). Customer acknowledges
          and agrees that (i) the GoMake System and Subscription Service may be accessed and used by the number of users, on the
          number of computers or devices, and/or at the number of sites, for the term and limited to the functionality set forth
          in the applicable Order; (ii) the GoMake System and the Subscription Service may be used for Customer’s internal normal
          business purposes solely to the extent described in the applicable Order. For the purpose hereof, the term “Subscription
          Service” shall mean the online services, computer applications, user interfaces, and any related technology to be made
          available by GoMake via the GoMake System that are specified in any applicable Order hereunder. 1.2 Customer will be
          required to register for the GoMake System in order to be able to exercise the rights granted under Section 1.1. As part
          of the registration process, Customer will identify an administrative username and password for Customer’s GoMake
          account. GoMake reserves the right to refuse registration of, or cancel passwords it deems inappropriate. GoMake will
          provide Customer user credentials in order to be able access the GoMake System. 2. SERVICES AND SUPPORT 2.1 Subject to
          the terms of this Agreement and to the Customer’s compliance therewith, GoMake will use commercially reasonable efforts
          to provide Customer with customer and technical support services during its normal business hours.. 3. NO COMMITMENT 3.1
          Customer understands and agrees that GoMake offers no commitments or guarantee of any minimum volume of users or of
          revenues under this Agreement. This Agreement is nonexclusive and does not grant Customer an exclusive right to receive
          any kind of services from GoMake, deliverables or licensed products and GoMake may offer its services, including, the
          GoMake System to any one or more additional customers at its sole discretion. 4. RESTRICTIONS AND RESPONSIBILITIES 4.1
          Customer will not, directly or indirectly reverse engineer, decompile, disassemble or otherwise attempt to discover the
          source code, object code or underlying structure, ideas, know-how or algorithms relevant to the System and/or the
          Services or any software, documentation or data related to the Services (“Software”); modify, translate, or create
          derivative works based on the Services or any Software (except to the extent expressly permitted by GoMake or authorized
          within the Services); use the Services or any Software for timesharing or service bureau purposes or otherwise for the
          benefit of a third; or remove any proprietary notices or labels. 4.2 Customer represents, covenants, and warrants that
          Customer will use the Services only in compliance with GoMake’s standard published policies then in effect (the
          “Policy”), if available, and all applicable laws and regulations. Customer hereby agrees to indemnify and hold harmless
          GoMake against any damages, losses, liabilities, settlements and expenses (including without limitation costs and
          attorneys’ fees) in connection with any claim or action that arises from an alleged violation of the foregoing or
          otherwise from Customer’s use of Services. 4.3 Although GoMake has no obligation to monitor Customer’s use of the
          Services, GoMake may do so and may prohibit any use of the Services it believes may be (or alleged to be) in violation
          of the foregoing. 4.4 Customer shall be responsible for obtaining and maintaining any equipment and ancillary services
          needed to connect to, access or otherwise use the Services, including, without limitation, modems, hardware, servers,
          software, operating systems, networking, web servers and the like (collectively, the “Equipment”). Customer shall also
          be responsible for maintaining the security of the Equipment, Customer account, passwords (including but not limited to
          administrative and user passwords) and files, and for all uses of Customer account or the Equipment with or without
          Customer’s knowledge or consent. 5. CONFIDENTIALITY; PROPRIETARY RIGHTS 5.1 Each party (the “Receiving Party”)
          understands that the other party (the “Disclosing Party”) has disclosed or may disclose business, technical or financial
          information relating to the Disclosing Party’s business (hereinafter referred to as “Proprietary Information” of the
          Disclosing Party). Proprietary Information of GoMake includes non-public information regarding features, functionality
          and performance of the Service. Proprietary Information of Customer includes non-public data provided by Customer to
          GoMake to enable the provision of the Services (“Customer Data”). The Receiving Party agrees: (i) to take reasonable
          precautions to protect such Proprietary Information, and (ii) not to use (except in performance of the Services or as
          otherwise permitted herein) or divulge to any third person any such 2 Proprietary Information. The Disclosing Party
          agrees that the foregoing shall not apply with respect to any information after five (5) years following the disclosure
          thereof or any information that the Receiving Party can document (a) is or becomes generally available to the public, or
          (b) was in its possession or known by it prior to receipt from the Disclosing Party, or (c) was rightfully disclosed to
          it without restriction by a third party, or (d) was independently developed without use of any Proprietary Information
          of the Disclosing Party or (e) is required to be disclosed by law. 5.2 The GoMake System, the Services, and GoMake Marks
          (defined below) as well as any software, applications, inventions or other technology developed in connection with or
          support, are proprietary products of GoMake. All rights, title, and interest, including copyrights, trademarks, trade
          names, trade secrets, and other intellectual property rights, and any goodwill associated therewith, in and to the
          GoMake System, the Services, and GoMake Marks, including learning material, articles, audio files, questions,
          explanations, graphic design, layout, and the user interfaces, and all derivatives, improvements, and variations
          thereof, are and will remain at all times, exclusively owned by, or licensed (by third parties), to GoMake. For
          avoidance of doubt, Customer shall not acquire any rights in the GoMake System, the Services, and GoMake Marks, and this
          Agreement grants the Customer no license to or any rights in the same other than those rights explicitly granted herein.
          5.3 Customer hereby represents that it owns all right, title and interest in and to the Customer Data, as well as any
          data that is based on or derived from the Customer Data and provided to Customer as part of the Services. 5.4 GoMake
          shall not be held responsible in any way for any Proprietary Information or other rights’ infringement or violation or
          the violation of any applicable laws, arising or relating to such Customer Data and/or communications; and (ii) that any
          personal information contained in any Customer Data has been collected and is maintained in compliance with applicable
          data protections laws. 5.5 Notwithstanding anything to the contrary, GoMake shall have the right collect and analyze
          data and other information relating to the provision, use and performance of various aspects of the Services and related
          systems and technologies (including, without limitation, information concerning Customer Data and data derived
          therefrom), and GoMake will be free (during and after the term hereof) to (i) use such information and data to improve
          and enhance the Services and for other development, diagnostic and corrective purposes in connection with the Services
          and other GoMake offerings, and (ii) disclose such data solely in aggregate or other de-identified form in connection
          with its business. No rights or licenses are granted except as expressly set forth herein. 5.6 [The Customer shall
          comply with all applicable data protection laws in connection with the exercise of its rights and the performance of its
          obligations under this Agreement. To the extent that GoMake processes any such Personal Data in the provision of the
          System and the SaaS Services, the Data Processing Agreement attached hereto as Annex A shall apply in connection
          thereto.][TBC] 6. CUSTOMER CONTENT Customer shall have the right to integrate in the GoMake System, its own input and
          information (the “Customer Input”). In the event that the Customer elects to use and integrate the Customer Input in the
          System, the Customer, shall have the right to submit, upload, publish or otherwise make available to the System textual,
          audio, video or other content and information. Customer represents and warrants that neither the Customer Input nor the
          Customer’s use thereof will infringe, misappropriate or violate a third party’s intellectual property rights, right of
          privacy, rights of publicity or result in violation of any applicable law by 3 Customer’s end users or any third party.
          Any Customer Input shall remain the property of the Customer. However, by submitting such Customer Input through the
          GoMake System, Customer hereby grants GoMake a worldwide, perpetual, irrevocable, transferable, royalty-free license,
          use, copy, and perform such User Generated Content in all formats through the GoMake System without further notice to or
          consent from Customer in order to ensure the provision of the Services. GoMake reserves the right, but is not obligated
          to, review and monitor and remove Customer Input in its sole discretion at any time without notice to Customer if such
          content is infringing any right of a third party. 7. USE OF GOMAKE TRADEMARKS 7.1 Subject to the terms and conditions of
          this Agreement, Customer shall have the nonexclusive, non-transferable right to use the trademark or service marks or
          name marks of GoMake used with respect to the GoMake System by GoMake (the “Marks”) during the term of this Agreement
          solely for using the Services for its internal normal business purposes. GoMake reserves the right to change its Marks
          and logos at any time. Nothing in this Agreement shall grant or shall be deemed to grant to Customer any right, title or
          interest in or to GoMake's Marks or logos. 7.2 Customer will not at any time challenge, or assist others in challenging,
          GoMake’s Marks or other proprietary rights, or do, cause to be done, or tolerate any act or thing contesting or in any
          way impairing or tending to impair any said right, title, and interest of GoMake in such Marks or other proprietary
          rights. Customer shall not use or register, in any jurisdictions, any trademark, service mark, device or logo or any
          word or mark identical with or confusingly similar to any of the Marks. 8. PAYMENT OF FEES 8.1 Customer will pay GoMake
          the then applicable fees described in the Order for the Services in accordance with the terms therein and herein,
          whether for a monthly subscrirbed package and/or a per task subscription (the “Fees”). If Customer’s use of the Services
          exceeds the Service capacity set forth on the Order or otherwise requires the payment of additional fees (per the terms
          of this Agreement), Customer shall be billed for such usage and Customer agrees to pay the additional fees in the manner
          provided herein. GoMake reserves the right to change the Fees or applicable charges and to institute new charges and
          Fees at the end of the Term or thencurrent renewal term, upon thirty (30) days prior notice to Customer (which may be
          sent by email). If Customer believes that GoMake has billed Customer incorrectly, Customer must contact GoMake no later
          than 45 days after the closing date on the first billing statement in which the error or problem appeared, in order to
          claim an adjustment or credit (subject to GoMake written approval). Inquiries should be directed to GoMake’s customer
          support department. 8.2 Without derogating from any other remedy available to GoMake hereunder or under applicable law,
          in the event that any Fees due to GoMake hereunder and under an Order is not paid when due, Customer shall be subject to
          a late fee at the rate of 1% per month on the outstanding amount or the maximum rate permitted by law, whichever is
          less. Each party shall bear and be responsible for the payment of all taxes applicable to it under this Agreement,
          including, without limitation, any sales, uses, property, excise, service, value added taxes, or other taxes, fees,
          duties, royalties or other amounts, however designated and on whichever party hereto, now or hereafter levied
          (collectively – “Taxes”), which are levied or based upon such charges or under this Agreement. All payments by Customer
          hereunder shall be made without any deduction and free and clear of and without any deduction for or on account of any
          Taxes (including without limitation any withholding tax or other applicable sales tax, if applicable). If any Tax or
          amounts in respect of Tax must be deducted, or any other deductions must be made, 4 from any amounts payable or paid to
          GoMake, Customer shall pay such additional amounts as may be necessary to ensure that GoMake receives a net amount equal
          to the full amount which it would have received had payment not been made subject to Tax or other deduction. 9. TERM AND
          TERMINATION 9.1 Subject to earlier termination as provided below, this Agreement is for the Term as specified in the
          Order, and shall be automatically renewed for additional periods of the same duration as the Term, unless either party
          requests termination at least thirty (30) days prior to the end of the then-current Term. 9.2 In addition to any other
          remedies it may have, either party may also terminate this Agreement upon thirty (30) days’ notice (or without notice in
          the case of nonpayment), if the other party materially breaches any of the terms or conditions of this Agreement, in
          which case, Customer will pay in full for the Services up to and including the last day on which the Services are
          provided. 9.3 Except as otherwise expressly provided herein, upon the expiration or termination of this Agreement
          Customer shall not be entitled to, and to the fullest extent permitted by law waives, any statutorily prescribed or
          other compensation, reimbursement or damages for loss of goodwill, clientele, prospective profits, investments or
          anticipated sales or commitments of any kind, and GoMake shall not be liable for or owe Customer any compensation of any
          sort as a result of the expiration or termination of this Agreement, other than as explicitly specified below. 9.4 All
          sections of this Agreement which by their nature should survive termination will survive termination or expiration
          thereof, including, without limitation, accrued rights to payment, confidentiality obligations, warranty disclaimers,
          and limitations of liability. 10. MODIFICATIONS AND ENHANCEMENTS. 10.1 GoMake shall have the right to implement routine
          enhancements to the GoMake System and/or the Services, as may be required to improve user experience without Customer’s
          consent, provided that (i) such modifications and enhancements have no adverse material impact on the Services; and (ii)
          such modifications and enhancements cause no increase in fees or other costs chargeable to Customer hereunder; and (iii)
          Customer has received notification of the proposed implementation of such enhancements. Changes to the GoMake System
          and/or the Services that are necessary for the security of the GoMake System and/or the Services or for compliance with
          applicable laws, licenses, regulations, or orders shall be deemed to be changes that are necessary on an emergency
          basis, in which cases, GoMake shall notify Customer thereof as soon as practicable, and the parties shall work together
          in good faith to resolve any concerns, problems, or performance issues created by such changes. 11. WARRANTY AND
          DISCLAIMER 11.1 GoMake shall use reasonable efforts consistent with prevailing industry standards to maintain the
          Services in a manner which minimizes errors and interruptions in the Services and/or the GoMake System and shall perform
          the Services in a professional and workmanlike manner. Notwithstanding the foregoing, Services and/or the GoMake System
          may be temporarily unavailable for scheduled maintenance or for unscheduled emergency maintenance, either by GoMake or
          by third-party providers, or because of other causes beyond GoMake’s reasonable control, but GoMake shall use reasonable
          efforts to provide advance notice in writing or by e-mail of any scheduled service disruption. HOWEVER, 5 GOMAKE DOES
          NOT WARRANT THAT THE SERVICES AND/OR THE GOMAKE SYSTEM WILL BE UNINTERRUPTED OR ERROR FREE; NOR DOES IT MAKE ANY
          WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM USE OF THE SERVICES AND/OR THE GOMAKE SYSTEM. EXCEPT AS EXPRESSLY
          SET FORTH IN THIS SECTION, THE SERVICES AND THE GOMAKE SYSTEM ARE PROVIDED “AS IS” AND GOMAKE DISCLAIMS ALL WARRANTIES,
          EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
          PURPOSE AND NON-INFRINGEMENT. 11.2 It is hereby clarified that the parties’ relationship under this Agreement is an
          agreement between GoMake and the Customer and not between GoMake and any of the Customer’s end users. To this effect,
          the Customer shall be responsible for handling any matter and/concern and/or claims raised by any of its end users and
          customers in connection with any of the Services and in connection with the GoMake System but shall immediately notify
          GoMake of any such matter and/or concern and/or claim where they related to the GoMake System and/or the Services. 11.3
          The Customer bears full and exclusive responsibility for using and/or utilizing the GoMake System as software authorized
          by the Israeli Income Tax Authority for managing computerized accounting systems. GoMake shall not be held liable for
          the precision of the GoMake System, including any parameters and variables specified therein (such as currency rates,
          tax rates, etc.), nor for any results generated or reports produced through the GoMake System. The Customer acknowledges
          that GoMake’s role is limited to providing the GoMake System and does not extend to assuming responsibility for the
          accuracy or applicability of the GoMake System's output to the Customer's specific circumstances. The Customer shall
          assume full responsibility for the accuracy and validity of all information and data entered into the GoMake System. It
          is the Customer's sole obligation to verify the correctness and authenticity of the information and data contained in
          reports and documents generated by the GoMake System. GoMake shall not be held liable for any consequences arising from
          the use of the GoMake System, including but not limited to loss of information, services, or content. Customer waives
          any claims against GoMake or any of its shareholders, directors, officers, or representatives concerning these matters.
          Furthermore, GoMake bears no responsibility for any breach or violation of tax laws or other legal provisions by the
          Customer or their representatives, including any misuse of the GoMake System or unlawful actions performed through it.
          GoMake reserves the right to modify or update the GoMake System periodically to ensure compliance with legal updates and
          amendments, and the Customer agrees to refrain from making any claims or demands against GoMake related to such
          modifications. 12. LIMITATION OF LIABILITY NOTWITHSTANDING ANYTHING TO THE CONTRARY, EXCEPT FOR BODILY INJURY OF A
          PERSON, GOMAKE AND GOMAKE AFFILIATES, PARENT AND SUBSIDIARIES, AS WELL AS THEIR RESPECTIVE SHAREHOLDERS, OFFICERS,
          DIRECTORS, AFFILIATES, REPRESENTATIVES, CONTRACTORS AND EMPLOYEES SHALL NOT BE RESPONSIBLE OR LIABLE WITH RESPECT TO ANY
          SUBJECT MATTER OF THIS AGREEMENT OR TERMS AND CONDITIONS RELATED THERETO UNDER ANY CONTRACT, NEGLIGENCE, STRICT
          LIABILITY OR OTHER THEORY: (A) FOR ERROR OR INTERRUPTION OF USE OR FOR LOSS OR INACCURACY OR CORRUPTION OF DATA OR COST
          OF PROCUREMENT OF SUBSTITUTE GOODS, SERVICES OR TECHNOLOGY OR LOSS OF BUSINESS; (B) FOR ANY INDIRECT, EXEMPLARY,
          INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES; (C) FOR ANY MATTER BEYOND GOMAKE’S REASONABLE CONTROL; OR (D) FOR ANY
          AMOUNTS THAT EXCEED THE SERVICE FEES PAID BY CUSTOMER TO GOMAKE HEREUNDER IN THE 12 MONTHS PERIOD PRIOR TO THE ACT THAT
          GAVE RISE TO THE 6 LIABILITY, IN EACH CASE, WHETHER OR NOT GOMAKE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          13. MISCELLANEOUS 13.1 No agency, partnership, joint venture, or employment is created as a result of this Agreement and
          Customer does not have any authority of any kind to bind GoMake in any respect whatsoever. This Agreement shall be
          governed, construed and interpreted in accordance with the laws of the State of Israel without giving effect to any
          choice or conflict of law provision or rule. Notwithstanding the foregoing, GoMake may seek injunction from a court in
          any other jurisdiction as it sees fit in order to enforce the provisions of this Agreement. No failure, delay of
          forbearance of GoMake in exercising any power or right hereunder shall in any way restrict or diminish GoMake’s rights
          and powers under this Agreement or operate as a waiver of any breach or nonperformance by either party of any terms of
          conditions hereof. Customer may not assign or delegate any of its rights, duties or undertakings hereunder to any third
          party, and any unauthorized assignment or delegation shall be null and void. GoMake shall have the right to assign this
          Agreement to a parent, a subsidiary or an affiliate, and to any succsser in interest in a merger, consolidation or
          acquisition transaction. If it shall be determined under any applicable law that a provision in this Agreement is
          invalid or unenforceable, the remaining provisions of this Agreement shall not be affected. This Agreement (and the
          Order) constitutes the entire agreement between Customer and GoMake, supersedes any and all prior discussions,
          agreements (in writing or verbally), drafts and correspondence with regard to the subject matter hereof, and may be
          amended only by written consent of both parties. All notices in connection with this Agreement shall be sent by
          registered mail or delivered by hand to the addresses set forth above and shall be deemed to have been delivered to the
          other party: (a) 3 business days from the date of mailing if sent by registered mail; (b) if delivered by hand – upon
          actual delivery at the address of the addressee; and (c) on the first business day following delivery, and subject to an
          electronic confirmation or receipt, if delivered by electronic mail. 7
        </div>
        <FormControlLabel
          control={
            <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} disabled={!isScrolledToBottom} />
          }
          label={t("I have read and accept the terms and conditions.")}
          style={{ alignSelf: "center", marginTop: "10px" }}
        />
        <Stack direction={"row"} gap={"10px"} justifyContent={"end"}>
          <SecondaryButton style={{ alignSelf: "center" }} variant="outlined" onClick={onClose}>
            {t("Decline")}
          </SecondaryButton>
          <SecondaryButton
            style={{ alignSelf: "center" }}
            variant="contained"
            onClick={handleAcceptTerms}
            disabled={!isAcceptButtonEnabled}
          >
            {t("Accept")}
          </SecondaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { TermModal };
