import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Server, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CONTACT_INFO } from "@/lib/contact-config"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Security Architecture at SIID</h1>
            <p className="text-xl text-muted-foreground">Data security, user privacy, and system integrity are fundamental to our architecture</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8">
              <Lock className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Data Encryption</h2>
              <p className="text-muted-foreground leading-relaxed">
                All data transmitted to and from SIID is encrypted using industry-standard TLS/SSL protocols. Sensitive project details are stored securely using AES-256 encryption.
              </p>
            </Card>

            <Card className="p-8">
              <Server className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Secure Infrastructure</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform is hosted on enterprise-grade cloud infrastructure with continuous monitoring, automated backups, and isolated database instances.
              </p>
            </Card>

            <Card className="p-8">
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Access Controls & RBAC</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement role-based access control (RBAC) and strict server-side authorization. Users can only access project data for which they have explicit permissions.
              </p>
            </Card>

            <Card className="p-8">
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Standards Alignment</h2>
              <p className="text-muted-foreground leading-relaxed">
                SIID is architected to align with GDPR data privacy principles, SOC 2 security framework standards, and ISO 27001 best practices for information security.
              </p>
            </Card>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Security Practices</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Code & Dependency Audits</h3>
                <p className="text-sm text-muted-foreground">
                  We perform static code analysis and dependency vulnerability scanning to ensure secure application deployment.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Server-Side Authorization</h3>
                <p className="text-sm text-muted-foreground">
                  All REST endpoints enforce server-side ownership checks to prevent unauthorized data access or Object-Level Authorization vulnerabilities.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Incident Response</h3>
                <p className="text-sm text-muted-foreground">
                  We maintain proactive monitoring and incident response procedures to respond immediately to operational anomalies.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Data Minimization</h3>
                <p className="text-sm text-muted-foreground">
                  We only retain data necessary for providing construction intelligence services and provide user data controls.
                </p>
              </Card>
            </div>
          </section>

          <div className="text-center bg-muted rounded-2xl p-12">
            <h2 className="text-2xl font-bold mb-4">Report a Security Inquiry</h2>
            <p className="text-muted-foreground mb-6">
              If you have security questions or wish to report a vulnerability, contact our dedicated security team.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground font-bold">
              <a href={`mailto:${CONTACT_INFO.securityEmail}`}>Contact Security Team ({CONTACT_INFO.securityEmail})</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
