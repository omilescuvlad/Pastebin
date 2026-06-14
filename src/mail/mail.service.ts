import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { User } from '../user/user.entity';
import { Paste } from '../paste/paste.entity';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendPasteCreatedEmail(user: User, paste: Paste) {
    if (!user.emailNotifications) {
      return;
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const downloadUrl = `${appUrl}/pastes/${paste.id}/download`;
    const unsubscribeUrl = `${appUrl}/users/unsubscribe/${user.unsubscribeToken}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'A pastebin was created',
      text: `
Hello ${user.username},

A pastebin was created.

Paste content:
${paste.content}

Download paste:
${downloadUrl}

Unsubscribe:
${unsubscribeUrl}
      `,
      html: `
        <h2>A pastebin was created</h2>

        <p>Hello ${user.username},</p>

        <p>Your paste was created successfully.</p>

        <h3>Paste content:</h3>
        <pre>${paste.content}</pre>

        <p>
          <a href="${downloadUrl}">Download paste as TXT</a>
        </p>

        <hr />

        <p>
          If you do not want to receive these emails anymore,
          <a href="${unsubscribeUrl}">unsubscribe here</a>.
        </p>
      `,
      attachments: [
        {
          filename: `paste-${paste.id}.txt`,
          content: paste.content,
        },
      ],
    });
  }
}