// src/components/Contact.tsx
'use client';

import React, { useMemo, useState } from 'react';
import {
    Mail,
    User,
    MessageSquare,
    Loader2,
    CheckCircle2,
    Shield,
    Briefcase,
    GraduationCap,
} from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type InquiryType = 'academic' | 'industry' | 'other';

type FormState = {
    name: string;
    email: string;
    message: string;
    inquiry: InquiryType;
};

type TouchState = Partial<Record<keyof FormState, boolean>>;
type ErrorState = Partial<Record<keyof FormState, string>>;

const initial: FormState = { name: '', email: '', message: '', inquiry: 'academic' };

// Keep your existing config
const GAS_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbzT7oa0dnuzIzoiOCFEu5gCfB6W-iwn5SaWMS98BDCBmE3GyN1LX5U0pfiMxN2-956NSA/exec';
const TO_EMAIL = 'mdmosfikurrahman.cse@gmail.com';

export default function Contact() {
    const [form, setForm] = useState<FormState>(initial);
    const [touched, setTouched] = useState<TouchState>({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [botField, setBotField] = useState(''); // honeypot

    // Validation
    const errors: ErrorState = useMemo(() => {
        const e: ErrorState = {};
        if (!form.name.trim()) e.name = 'Please enter your name.';
        const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(form.email);
        if (!form.email.trim()) e.email = 'Please enter your email.';
        else if (!emailOk) e.email = 'Please provide a valid email address.';
        if (!form.message.trim()) e.message = 'Please write a short message.';
        else if (form.message.trim().length < 10)
            e.message = 'Message should be at least 10 characters.';
        return e;
    }, [form]);

    const hasErrors = Object.keys(errors).length > 0;

    const setField =
        (name: keyof FormState) =>
            (value: string) => {
                setForm((prev) => ({ ...prev, [name]: value }));
            };

    const onBlur =
        (name: keyof FormState) =>
            () => {
                setTouched((t) => ({ ...t, [name]: true }));
            };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (botField) return; // ignore bots

        // mark all touched to show errors if any
        setTouched({ name: true, email: true, message: true, inquiry: true });

        if (hasErrors) return;

        if (!GAS_ENDPOINT || !TO_EMAIL) {
            setError('Contact form is not configured. Please try again later.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // NOTE: with mode: 'no-cors' we cannot read the response; this is an optimistic submit.
            await fetch(GAS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: new URLSearchParams({
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    to: TO_EMAIL,
                    inquiry: form.inquiry,
                }).toString(),
                mode: 'no-cors',
            });

            setSent(true);
            setForm(initial);
            setTouched({});
        } catch {
            setError('Something went wrong while sending your message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section
                id="contact"
                className="scroll-mt-20 py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Contact Me
                        </h2>
                        <p className="text-lg text-gray-600">
                            Have a question or opportunity? I’ll reply to your email promptly.
                        </p>
                    </div>

                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-5">
                                {/* Context / Info panel */}
                                <aside className="md:col-span-2 p-8 bg-gradient-to-b from-primary/5 to-blue-500/5 border-r border-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                    <div className="space-y-6">
                                        <div>
                                            <CardTitle className="text-xl text-gray-900 mb-2">
                                                Let’s collaborate
                                            </CardTitle>
                                            <p className="text-gray-700">
                                                Open to backend engineering roles, research collaborations, and impactful system-design projects.
                                            </p>
                                        </div>

                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium text-gray-900 break-all">
                                                        {TO_EMAIL}
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <Shield className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Privacy</p>
                                                    <p className="text-gray-900 text-sm">
                                                        Your details are used only to respond to your
                                                        message.
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>

                                        <div className="text-xs text-gray-500">
                                            Prefer your email client?{' '}
                                            <a
                                                className="text-primary underline underline-offset-2"
                                                href={`mailto:${TO_EMAIL}?subject=Website%20Contact`}
                                            >
                                                Send a direct email
                                            </a>
                                            .
                                        </div>
                                    </div>
                                </aside>

                                {/* Form */}
                                <div className="md:col-span-3 p-8">
                                    <form
                                        onSubmit={onSubmit}
                                        className="space-y-5"
                                        noValidate
                                        autoComplete="off"
                                        aria-describedby="form-status"
                                    >
                                        {/* Honeypot */}
                                        <input
                                            type="text"
                                            value={botField}
                                            onChange={(e) => setBotField(e.target.value)}
                                            className="hidden"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            aria-hidden="true"
                                        />

                                        {/* Inquiry type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Inquiry type
                                            </label>
                                            <div
                                                className="flex flex-wrap gap-2"
                                                role="group"
                                                aria-label="Inquiry type"
                                            >
                                                {[
                                                    {
                                                        key: 'academic' as InquiryType,
                                                        label: 'Academic (Advisor/Admissions)',
                                                        icon: (
                                                            <GraduationCap className="w-4 h-4" />
                                                        ),
                                                    },
                                                    {
                                                        key: 'industry' as InquiryType,
                                                        label: 'Industry (Recruiter/Team)',
                                                        icon: <Briefcase className="w-4 h-4" />,
                                                    },
                                                    {
                                                        key: 'other' as InquiryType,
                                                        label: 'Other',
                                                        icon: <MessageSquare className="w-4 h-4" />,
                                                    },
                                                ].map(({ key, label, icon }) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() =>
                                                            setForm((f) => ({ ...f, inquiry: key }))
                                                        }
                                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                                            form.inquiry === key
                                                                ? 'bg-primary text-primary-foreground border-primary'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                        }`}
                                                        aria-pressed={form.inquiry === key}
                                                        aria-label={label}
                                                    >
                                                        {icon}
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Your name
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <User className="w-4 h-4" />
                                                </span>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={(e) =>
                                                        setField('name')(e.target.value)
                                                    }
                                                    onBlur={onBlur('name')}
                                                    className={`w-full rounded-lg border px-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary ${
                                                        touched.name && errors.name
                                                            ? 'border-red-400'
                                                            : 'border-gray-300'
                                                    }`}
                                                    placeholder="Jane Doe"
                                                    aria-invalid={
                                                        !!(touched.name && errors.name)
                                                    }
                                                    aria-describedby={
                                                        touched.name && errors.name
                                                            ? 'name-error'
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            {touched.name && errors.name && (
                                                <p
                                                    id="name-error"
                                                    className="mt-1 text-sm text-red-600"
                                                >
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Your email
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                </span>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={(e) =>
                                                        setField('email')(e.target.value)
                                                    }
                                                    onBlur={onBlur('email')}
                                                    className={`w-full rounded-lg border px-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary ${
                                                        touched.email && errors.email
                                                            ? 'border-red-400'
                                                            : 'border-gray-300'
                                                    }`}
                                                    placeholder="jane@example.com"
                                                    aria-invalid={
                                                        !!(touched.email && errors.email)
                                                    }
                                                    aria-describedby={
                                                        touched.email && errors.email
                                                            ? 'email-error'
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            {touched.email && errors.email && (
                                                <p
                                                    id="email-error"
                                                    className="mt-1 text-sm text-red-600"
                                                >
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label
                                                htmlFor="message"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Message
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-400">
                                                    <MessageSquare className="w-4 h-4" />
                                                </span>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    value={form.message}
                                                    onChange={(e) =>
                                                        setField('message')(e.target.value)
                                                    }
                                                    onBlur={onBlur('message')}
                                                    rows={6}
                                                    className={`w-full rounded-lg border px-9 py-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                                                        touched.message && errors.message
                                                            ? 'border-red-400'
                                                            : 'border-gray-300'
                                                    }`}
                                                    placeholder="Tell me a bit about your project, research, or question..."
                                                    aria-invalid={
                                                        !!(touched.message && errors.message)
                                                    }
                                                    aria-describedby={
                                                        touched.message && errors.message
                                                            ? 'message-error'
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            {touched.message && errors.message && (
                                                <p
                                                    id="message-error"
                                                    className="mt-1 text-sm text-red-600"
                                                >
                                                    {errors.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div id="form-status" className="min-h-[1.5rem]">
                                            {error && (
                                                <p className="text-sm text-red-600">{error}</p>
                                            )}
                                            {sent && !error && (
                                                <p className="text-sm text-green-700 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Message sent! I’ll get back to you soon.
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end">
                                            <Button
                                                type="submit"
                                                disabled={loading || sent}
                                                className="inline-flex items-center gap-2"
                                            >
                                                {loading && (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                )}
                                                {sent ? 'Sent' : 'Send message'}
                                            </Button>
                                        </div>

                                        {/* Small print */}
                                        <p className="text-xs text-gray-500">
                                            This site uses a simple spam trap (no tracking). By
                                            submitting, you consent to being contacted about your
                                            inquiry.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 bg-gray-100 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Md. Mosfikur Rahman. All rights reserved.
                </p>
            </footer>
        </>
    );
}
