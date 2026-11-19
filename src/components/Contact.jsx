import { useState } from 'react';
import Window from './Window.jsx';
import Dialog from './Dialog.jsx';
import { site } from '../config.js';

const encode = (data) => new URLSearchParams(data).toString();

/** Contact form ("New Message" window), submitted to Netlify Forms. */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | sending | sent | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...form }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Window id="contact" title="New Message" icon="mail" className="mail" menu={['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Message', 'Help']}>
        <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}>
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="mail-toolbar">
            <button type="submit" className="default" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send'}
            </button>
            {site.email && (
              <a className="mail-direct" href={`mailto:${site.email}`}>
                or email {site.email}
              </a>
            )}
          </div>

          <div className="mail-fields">
            <label htmlFor="c-to">To:</label>
            <input id="c-to" readOnly value={site.artist} />
            <label htmlFor="c-name">From:</label>
            <input id="c-name" name="name" required placeholder="Your name" value={form.name} onChange={set('name')} />
            <label htmlFor="c-email">Email:</label>
            <input id="c-email" name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} />
            <label htmlFor="c-subject">Subject:</label>
            <input id="c-subject" name="subject" placeholder="Bookings, collabs, paintings..." value={form.subject} onChange={set('subject')} />
          </div>
          <textarea className="mail-body" name="message" required rows={10} value={form.message} onChange={set('message')} aria-label="Message" />
        </form>

        {site.socials.length > 0 && (
          <div className="mail-socials">
            {site.socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        )}
      </Window>

      {status === 'sent' && (
        <Dialog title="Message Sent" icon="info" onClose={() => setStatus(null)}>
          Your message has been sent. {site.artist} will get back to you soon.
        </Dialog>
      )}
      {status === 'error' && (
        <Dialog title="Outlook Express" icon="info" onClose={() => setStatus(null)}>
          The message could not be sent. Please try again in a moment.
        </Dialog>
      )}
    </>
  );
}
