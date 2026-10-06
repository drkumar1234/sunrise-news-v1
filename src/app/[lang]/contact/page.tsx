'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Language } from '@/types';

export default function ContactUsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'newsroom',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="border-b-2 border-brand-navy pb-4">
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సంప్రదించండి (Contact Sunrise News)' : 'Contact the Newsroom & Bureaus'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'వార్తా సూచనలు, ప్రెస్ నోట్లు లేదా పాఠకుల సమస్యల కోసం మా సంపాదక విభాగాన్ని నేరుగా సంప్రదించండి.'
            : 'Reach our editorial desk, reporting bureaus, grievance redressal officer, or commercial team.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Form (7 Cols) */}
        <div className="md:col-span-7 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">
                {isTelugu ? 'మీ సందేశం చేరింది!' : 'Message Received!'}
              </h2>
              <p className="text-xs text-slate-600">
                {isTelugu
                  ? 'మా డెస్క్ మీ సందేశాన్ని సమీక్షించి త్వరలోనే స్పందిస్తుంది.'
                  : 'Thank you. Our news desk will review your submission and reply shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTelugu ? 'పూర్తి పేరు:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTelugu ? 'ఈమెయిల్ చిరునామా:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTelugu ? 'విభాగం:' : 'Department:'}
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="newsroom">{isTelugu ? 'వార్తా విభాగం (Editorial / News Desk)' : 'Editorial / News Desk'}</option>
                  <option value="factcheck">{isTelugu ? 'ఫ్యాక్ట్ చెక్ డెస్క్ (Fact Check Team)' : 'Fact-Check Team'}</option>
                  <option value="grievance">{isTelugu ? 'ఫిర్యాదుల విభాగం (Grievance Redressal)' : 'Grievance Redressal Officer'}</option>
                  <option value="ads">{isTelugu ? 'ప్రకటనలు & వాణిజ్యం (Advertising)' : 'Advertising & Sponsorship'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTelugu ? 'సందేశం లేదా వార్తా సూచన:' : 'Message / News Tip:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl font-bold transition-colors shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isTelugu ? 'సందేశాన్ని పంపండి' : 'Submit Inquiries'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Bureau Contacts (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-brand-navy text-white p-6 rounded-2xl space-y-4 shadow-md text-xs">
            <h2 className="text-base font-bold text-amber-300 uppercase">
              {isTelugu ? 'కేంద్ర కార్యాలయం' : 'Central Bureau'}
            </h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                <span>Sunrise Bhavan, Seed Capital Access Road, Rayapudi, Amaravati, AP 522237</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>+91 866 245 8899</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>editor@sunrisenews.in</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 text-xs space-y-2">
            <h3 className="font-bold text-slate-900">
              {isTelugu ? 'గోప్యతా వార్తా సూచనలు (Whistleblower Tips)' : 'Confidential Whistleblower Tips'}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {isTelugu
                ? 'అవినీతి లేదా చట్టవిరుద్ధ చర్యలపై పత్రాలతో కూడిన సమాచారాన్ని సురక్షితంగా whistle@sunrisenews.in కు పంపవచ్చు.'
                : 'Sensitive public disclosures with documentation may be shared securely with our investigative desk via whistle@sunrisenews.in.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
