import airbnbLogo from '../assets/company-logos/airbnb.svg';
import netflixLogo from '../assets/company-logos/netflix.svg';
import stripeLogo from '../assets/company-logos/stripe.svg';

const COMPANY_LOGOS = new Map([
  ['airbnb', airbnbLogo],
  ['netflix', netflixLogo],
  ['stripe', stripeLogo],
]);

function getCompanyLogo(companyName = '') {
  const normalizedName = companyName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  for (const [brand, logo] of COMPANY_LOGOS) {
    if (normalizedName === brand || normalizedName.startsWith(`${brand}inc`)) {
      return logo;
    }
  }

  return null;
}

export default function CompanyLogo({ companyName = '' }) {
  const logo = getCompanyLogo(companyName);

  if (logo) {
    return (
      <span className="tracker-company-mark shrink-0" role="img" aria-label={`${companyName} logo`}>
        <img className="h-6 w-6 object-contain" src={logo} alt="" draggable="false" />
      </span>
    );
  }

  return (
    <span className="tracker-company-mark shrink-0" aria-hidden="true">
      {companyName.trim().charAt(0).toUpperCase() || 'C'}
    </span>
  );
}
