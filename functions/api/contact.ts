interface ContactEnv {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface ContactDetails {
  name: string;
  gender: string;
  mobile: string;
  age: number;
}

const allowedGenders = new Set(['Female', 'Male', 'Other', 'Prefer not to say']);

export const onRequestPost: PagesFunction<ContactEnv> = async ({ request, env }) => {
  let input: Partial<ContactDetails>;
  try {
    input = await request.json() as Partial<ContactDetails>;
  } catch {
    return Response.json({ error: 'Please submit valid form details.' }, { status: 400 });
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const gender = typeof input.gender === 'string' ? input.gender : '';
  const mobile = typeof input.mobile === 'string' ? input.mobile.trim() : '';
  const age = Number(input.age);
  const mobileDigits = mobile.replace(/\D/g, '').length;
  if (name.length < 2 || name.length > 100 || !allowedGenders.has(gender) ||
      !/^[+\d() .-]{1,20}$/.test(mobile) || mobileDigits < 7 || mobileDigits > 15 ||
      !Number.isInteger(age) || age < 1 || age > 120) {
    return Response.json({ error: 'Please check each field and try again.' }, { status: 400 });
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return Response.json({ error: 'Enquiries are not configured yet. Please call us instead.' }, { status: 503 });
  }

  const email = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_EMAIL],
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nGender: ${gender}\nMobile number: ${mobile}\nAge: ${age}`,
    }),
  });

  if (!email.ok) {
    return Response.json({ error: 'We could not send your enquiry right now. Please try again later.' }, { status: 502 });
  }
  return Response.json({ ok: true });
};
