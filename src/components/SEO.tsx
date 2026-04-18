import { Helmet } from "react-helmet-async";

const SITE_URL = "https://rp-golden-clinic.pages.dev";
const DEFAULT_IMAGE = `${SITE_URL}/logo-rp.png`;

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function SEO({ title, description, path, image = DEFAULT_IMAGE, noindex = false, schema }: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("RP Golden") ? title : `${title} | RP Golden Clinic`;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}

export function medicalProcedureSchema(opts: {
  name: string;
  description: string;
  path: string;
  procedureType?: string;
  bodyLocation?: string;
  followup?: string;
  preparation?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    procedureType: opts.procedureType ?? "https://schema.org/TherapeuticProcedure",
    ...(opts.bodyLocation ? { bodyLocation: opts.bodyLocation } : {}),
    ...(opts.followup ? { followup: opts.followup } : {}),
    ...(opts.preparation ? { preparation: opts.preparation } : {}),
    performer: {
      "@type": "Physician",
      name: "Dra. Roberta Castro Peres",
      identifier: "CRM 160891",
      medicalSpecialty: "Dermatology",
    },
  };
}
