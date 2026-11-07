const pins = [
  { id: '1097400634234839951', title: 'Barber Shop Website Design (Modern Dark & Gold UI/UX)' },
  { id: '779896860484758072', title: 'Barbershop High-Conversion Landing Page & Booking UI' },
  { id: '182677328633055770', title: 'Barbershop Website Layout & Menu de Serviços' },
  { id: '39828777962413450', title: 'Barbershop Premium Website Concept' },
  { id: '490822059407955481', title: 'Barber Studio Inspiring Web Design' },
  { id: '469429961182453297', title: 'Black and White Vintage Barber Website' },
  { id: '583286589284661871', title: 'Gentleman Barbershop Web Experience' }
];

async function verify() {
  for (const p of pins) {
    const url = `https://www.pinterest.com/pin/${p.id}/`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    console.log(`PIN ${p.id} -> ${res.status} | ${url}`);
  }
}

verify();
