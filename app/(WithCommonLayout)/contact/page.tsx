'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetSettingsQuery } from '@/services/settingsApi';
import { useSubmitContactMessageMutation } from '@/services/contactMessageApi';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Package, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ContactPage() {
  const { data: settings } = useGetSettingsQuery();

  const general = settings?.general;
  const storeName = general?.storeName || general?.siteName || 'GrowthZen Trends';
  const supportPhone = general?.supportPhone || '+880 1700-000000';
  const supportEmail = general?.supportEmail || general?.storeEmail || 'support@growthzen.com';
  const businessAddress = general?.businessAddress || 'Dhaka, Bangladesh';

  const [submitContactMessage, { isLoading }] = useSubmitContactMessageMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const trimmedSubject = formData.subject.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please complete all required fields (Name, Email, and Message).',
      });
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject || undefined,
        message: trimmedMessage,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your message has been sent successfully. Our support team will get back to you soon.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4500,
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Unable to send your message at this time. Please verify your internet connection or try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || isLoading;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 font-sans">
      <title>Contact Us - {storeName}</title>

      <Container className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/50 mb-1">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Have questions about an order, product details, or reseller partnership? We&apos;re here to assist you 6 days a week.
          </p>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Get In Touch
              </h2>

              <div className="flex flex-col gap-5 text-xs sm:text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Phone Support</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{supportPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Email Address</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{supportEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Business Address</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{businessAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Support Hours</span>
                    <p className="text-slate-500 dark:text-slate-400">Saturday – Thursday: 9:00 AM – 8:00 PM</p>
                    <p className="text-slate-400 text-xs">Friday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful Order Support Callout Card */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Existing Order Support</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Track or manage delivered orders</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
                <Link
                  href="/order/my-orders"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  My Orders
                </Link>
                <Link
                  href="/invoice/my-invoices"
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  My Invoices
                </Link>
                <Link
                  href="/refund-policy"
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Return Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Send Message Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fill out the form below and our customer care team will respond within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isFormDisabled}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Md Juyel Rana"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isFormDisabled}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  disabled={isFormDisabled}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Order Inquiry / Product Question"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  disabled={isFormDisabled}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-y disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isFormDisabled}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 mt-2"
              >
                {isFormDisabled ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
