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

const allowedGenders = new Set([
  'Female',
  'Male',
  'Other',
  'Prefer not to say',
]);

const TEMPLATE_ID = 'e8abfe9a-a9d3-4021-8a13-0bc59feae885';

export const onRequestPost: PagesFunction<ContactEnv> = async ({
  request,
  env,
}) => {
  let input: Partial<ContactDetails>;

  try {
    input = await request.json() as Partial<ContactDetails>;
  } catch {
    return Response.json(
      { error: 'Please submit valid form details.' },
      { status: 400 },
    );
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const gender = typeof input.gender === 'string' ? input.gender : '';
  const mobile = typeof input.mobile === 'string' ? input.mobile.trim() : '';
  const age = Number(input.age);

  if (
    name.length < 2 ||
    name.length > 100 ||
    !allowedGenders.has(gender) ||
    !/^\+91\d{10}$/.test(mobile) ||
    !Number.isInteger(age) ||
    age < 17 ||
    age > 80
  ) {
    return Response.json(
      { error: 'Please check each field and try again.' },
      { status: 400 },
    );
  }

  if (
    !env.RESEND_API_KEY ||
    !env.CONTACT_EMAIL ||
    !env.CONTACT_FROM_EMAIL
  ) {
    return Response.json(
      {
        error:
          'Enquiries are not configured yet. Please call us instead.',
      },
      { status: 503 },
    );
  }

  try {
    const email = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_EMAIL],
        subject: `New student enquiry from ${name}`,
        template: {
          id: TEMPLATE_ID,
          variables: {
            NAME: name,
            GENDER: gender,
            MOBILE_NUMBER: mobile,
            AGE: String(age),
          },
        },
      }),
    });

    if (!email.ok) {
      // Keep detailed provider errors in server logs only.
      console.error(
        'Resend template email failed:',
        email.status,
        await email.text(),
      );

      return Response.json(
        {
          error:
            'We could not send your enquiry right now. Please try again later.',
        },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Enquiry email request failed:', error);

    return Response.json(
      {
        error:
          'We could not send your enquiry right now. Please try again later.',
      },
      { status: 502 },
    );
  }
};
