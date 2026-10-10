import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getSettings } from '@/lib/public-articles';

export const dynamic = 'force-dynamic';

export default async function ContactUsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const isTelugu = resolvedParams.lang === 'te';
  const settings = await getSettings();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail) ? settings.contactEmail : '';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="border-b-2 border-brand-navy pb-4">
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సంప్రదించండి (Contact Sunrise News)' : 'Contact the Newsroom & Bureaus'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu ? 'వార్తా సూచనలు, ప్రెస్ నోట్లు లేదా సవరణల కోసం మా సంపాదక విభాగాన్ని సంప్రదించండి.' : 'Contact the editorial desk with news tips, press notes, corrections, or reader questions.'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{isTelugu ? 'సంపాదక విభాగానికి ఈమెయిల్ పంపండి' : 'Email the Editorial Desk'}</h2>
          <p className="text-sm text-slate-600">
            {isTelugu ? 'ఆన్‌లైన్ సంప్రదింపు ఫారం ప్రస్తుతం అందుబాటులో లేదు. క్రింద ఉన్న ఈమెయిల్ చిరునామాను ఉపయోగించండి. సవరణ కోసం కథనం లింక్ మరియు సంబంధిత వివరాలను చేర్చండి.' : 'The online contact form is not available yet. Use the email address below. For corrections, include the article link and details of the issue.'}
          </p>
          {email && <a className="inline-flex items-center gap-2 text-brand-orange font-bold break-all" href={`mailto:${encodeURIComponent(email)}`}><Mail className="w-4 h-4" />{email}</a>}
        </div>
        <div className="md:col-span-5 bg-brand-navy text-white p-6 rounded-2xl space-y-4 shadow-md text-xs">
          <h2 className="text-base font-bold text-amber-300 uppercase">{isTelugu ? 'కేంద్ర కార్యాలయం' : 'Central Bureau'}</h2>
          <div className="flex items-start gap-2.5 text-slate-300"><MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" /><span>{settings.addressAmaravati}</span></div>
          <div className="flex items-center gap-2.5 text-slate-300"><Phone className="w-4 h-4 text-brand-orange flex-shrink-0" /><span>{settings.contactPhone}</span></div>
          <div className="flex items-center gap-2.5 text-slate-300"><Mail className="w-4 h-4 text-brand-orange flex-shrink-0" /><span>{settings.contactEmail}</span></div>
        </div>
      </div>
    </div>
  );
}
