import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Introduction</h2>
            <p className="text-muted-foreground">
              Job Matchmakers ("we" or "us" or "our") operates the Job Matchmakers website. This page informs you of our
              policies regarding the collection, use, and disclosure of personal data when you use our service and the
              choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Information Collection</h2>
            <p className="text-muted-foreground mb-3">
              We collect several different types of information for various purposes to provide and improve our service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Personal Data:</strong> When you register, we collect your name, email address, and profile
                information
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our
                service
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies to track your preferences and improve user experience
              </li>
              <li>
                <strong>Resume Data:</strong> Your resume and professional information is securely stored
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Use of Data</h2>
            <p className="text-muted-foreground mb-3">Job Matchmakers uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service</li>
              <li>To provide customer support</li>
              <li>To improve and optimize our service</li>
              <li>To analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Security of Data</h2>
            <p className="text-muted-foreground">
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
              protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@jobmatchmakers.com.
            </p>
          </section>

          <p className="text-sm text-muted-foreground pt-4 border-t border-border">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </Card>
      </div>
    </div>
  )
}
