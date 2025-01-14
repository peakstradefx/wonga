import nodemailer, { Transporter } from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}

interface EmailContent {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter;
  private static instance: EmailService;
  private static readonly DEFAULT_CONFIG: EmailConfig = {
    host: process.env.NEXT_PUBLIC_EMAIL_HOST || "",
    port: Number(process.env.NEXT_PUBLIC_EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER || "",
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD || "",
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  private constructor(config: EmailConfig) {
    if (
      !process.env.NEXT_PUBLIC_EMAIL_HOST ||
      !process.env.NEXT_PUBLIC_EMAIL_USER ||
      !process.env.NEXT_PUBLIC_EMAIL_PASSWORD
    ) {
      throw new Error(
        "Missing required email configuration environment variables"
      );
    }
    this.transporter = nodemailer.createTransport(config);
  }

  static async initialize(customConfig?: EmailConfig): Promise<EmailService> {
    if (!EmailService.instance) {
      try {
        const config = customConfig || EmailService.DEFAULT_CONFIG;
        EmailService.instance = new EmailService(config);
        await EmailService.instance.transporter.verify();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Failed to initialize email service: ${error.message}`
          );
        } else {
          throw new Error(
            "Failed to initialize email service due to an unknown error"
          );
        }
      }
    }
    return EmailService.instance;
  }

  async sendEmail(content: EmailContent): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.NEXT_PUBLIC_EMAIL_FROM,
        ...content,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      throw new Error("Failed to send email due to an unknown error");
    }
  }

  async sendWelcomeEmail(user: {
    firstName: string;
    email: string;
  }): Promise<void> {
    const emailTemplate = `
    <div style="background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
      <img src="https://res.cloudinary.com/ddveex5ye/image/upload/v1736015725/peak-logo3_zhkdew.png" width="250px" height="auto" alt="PeaksTrade FX Logo" style="display: flex; justify-content: center;" />
    </div>
      <h5>Welcome to PeaksTrade FX, ${user.firstName}!</h5>
      <p>Your registration is successful and we are really excited to welcome you to PeaksTrade FX community!</p>
      <p>Your account has been activated but under review, you will be able to access your account soon once you are been confirmed, then you can invest and start earning!</p>
      <p>If you need any help, do not hesitate to reach out to us at ${process.env.NEXT_PUBLIC_EMAIL_FROM}</p>
      <br />
      <p>Best regards,<br />PeaksTrade FX</p>
    `;
    await this.sendEmail({
      to: user.email,
      subject: "New Registration",
      html: emailTemplate,
    });
  }

  async sendPasswordResetEmail(user: {
    firstName: string;
    email: string;
    code: string;
  }): Promise<void> {
    const emailTemplate = `
    <div style="background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
      <img src="https://res.cloudinary.com/ddveex5ye/image/upload/v1736015725/peak-logo3_zhkdew.png" width="250px" height="auto" alt="PeaksTrade FX Logo" style="display: flex; justify-content: center;" />
    </div>
      <h3>Password Reset Request - PeaksTrade FX</h3>
      <p>Hello ${user.firstName},</p>
      <p>We received a request to reset your password for your PeaksTrade FX account. Use the verification code below to complete your password reset:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
      <strong>${user.code}</strong>
      </div>
      <p>This code will expire in 15 minutes for security purposes.</p>
      <p>If you did not request this password reset, please contact our support team immediately at ${process.env.NEXT_PUBLIC_EMAIL_FROM}</p>
      <br/>
      <p>For security reasons, never share this code with anyone.</p>
      <br/>
      <p>Best regards,<br/>PeaksTrade FX Team</p>
    `;
    await this.sendEmail({
      to: user.email,
      subject: "Password Reset Code - PeaksTrade FX",
      html: emailTemplate,
    });
  }
}

const createEmailService = async () => {
  return await EmailService.initialize();
};

export {
  EmailService,
  createEmailService,
  type EmailConfig,
  type EmailContent,
};
