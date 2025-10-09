require("dotenv").config();
const fetch = require("node-fetch");

const BLOG_ADMIN_API_KEY = process.env.BLOG_ADMIN_API_KEY;
const BACKEND_URL = "http://localhost:3000"; // Assuming local backend for seeding

const blogPostsToSeed = [
  {
    title:
      "Powering Nigeria's Future: The Rise of Solar Mini-Grids and Green Hydrogen",
    content: `<p>Nigeria\'s energy landscape is undergoing a significant transformation, driven by a dual imperative: addressing persistent energy deficits and embracing a sustainable future. At the forefront of this revolution are solar mini-grids and the burgeoning potential of green hydrogen, offering robust solutions for both urban and rural communities.</p>

<h3>The Promise of Solar Mini-Grids</h3>
<p>For too long, remote and underserved communities in Nigeria have lacked access to reliable electricity. Solar mini-grids are changing this narrative. These decentralized power systems, powered by abundant sunlight, provide clean, consistent, and affordable energy, fostering economic growth and improving quality of life. Government initiatives like the Renewable Energy Master Plan (REMP) and the Solar Power Naija Program are actively promoting their deployment, creating a fertile ground for investment and innovation.</p>

<h3>Green Hydrogen: A New Frontier</h3>
<p>Beyond traditional solar, the production of green hydrogen is emerging as a game-changer. Produced through electrolysis powered by renewable energy, green hydrogen offers a clean fuel source for various sectors, including transportation, industry, and power generation. Nigeria, with its vast renewable energy potential, is uniquely positioned to become a key player in the global green hydrogen market, attracting significant investment and driving technological advancement.</p>

<h3>SEESL\'s Role in the Transition</h3>
<p>At Solution Energy and Engineering Services Ltd (SEESL), we are at the forefront of this energy transition. Our expertise spans:</p>
<ul>
    <li><strong>Mini-grid Design and Development:</strong> Crafting bespoke solar solutions for communities and industries.</li>
    <li><strong>Solar Installations:</strong> Delivering reliable solar power systems for homes, estates, and commercial facilities.</li>
    <li><strong>Green Hydrogen Production and Storage:</strong> Pioneering solutions for the sustainable production and management of this future fuel.</li>
    <li><strong>Energy Audits:</strong> Helping businesses optimize their energy consumption and transition to renewables efficiently.</li>
</ul>
<p>The shift to renewable energy is not just an environmental necessity; it\'s an economic opportunity. By embracing solar mini-grids and green hydrogen, Nigeria can unlock new pathways to energy security, industrial growth, and a cleaner, more prosperous future.</p>`,
    author_name: "George Samuel Etim",
    image_url:
      "https://images.pexels.com/photos/7316634/pexels-photo-7316634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: [
      "Renewable Energy",
      "Nigeria",
      "Solar",
      "Mini-Grids",
      "Green Hydrogen",
      "Sustainability",
    ],
    published: true,
  },
  {
    title:
      "Beyond Break-Fix: Predictive Maintenance and AI in Industrial Asset Management",
    content: `<p>In today\'s rapidly evolving industrial landscape, simply reacting to equipment failures is no longer a viable strategy. Forward-thinking companies are moving "beyond break-fix" to embrace advanced asset management practices, with predictive maintenance and artificial intelligence (AI) leading the charge. This shift is not just about preventing downtime; it\'s about optimizing performance, extending asset lifespan, and achieving significant cost savings.</p>

<h3>The Power of Predictive Maintenance</h3>
<p>Predictive maintenance (PdM) utilizes data analytics, sensors, and IoT devices to monitor asset condition in real-time. By analyzing patterns and anomalies, PdM can forecast potential equipment failures before they occur, allowing for scheduled maintenance interventions. This proactive approach drastically reduces unplanned downtime, minimizes maintenance costs, and improves operational efficiency compared to traditional time-based or reactive maintenance.</p>

<h3>AI: The Brains Behind Smart Asset Management</h3>
<p>Artificial intelligence takes predictive maintenance to the next level. AI algorithms can process vast amounts of data from various sources – including vibration sensors, thermal imaging, operational history, and environmental factors – to identify subtle indicators of impending failure that human analysis might miss. AI-powered systems can:</p>
<ul>
    <li><strong>Enhance Anomaly Detection:</strong> Pinpoint unusual behavior in complex machinery.</li>
    <li><strong>Optimize Maintenance Schedules:</strong> Recommend the ideal time for maintenance, balancing risk and cost.</li>
    <li><strong>Improve Root Cause Analysis:</strong> Quickly identify the underlying causes of recurring issues.</li>
    <li><strong>Automate Decision-Making:</strong> Trigger alerts or even initiate maintenance workflows autonomously.</li>
</ul>

<h3>SEESL\'s Integrated Approach</h3>
<p>At Solution Energy and Engineering Services Ltd (SEESL), we integrate these cutting-edge technologies into our comprehensive Asset Management services. Our offerings include:</p>
<ul>
    <li><strong>Digital Monitoring Systems:</strong> 24/7 remote asset surveillance and predictive analytics.</li>
    <li><strong>Automated Corrosion Mapping:</strong> Utilizing advanced techniques to assess and prevent asset degradation.</li>
    <li><strong>Inspection Services & NDT:</strong> Proactive identification of potential issues.</li>
    <li><strong>Smart Analytics Dashboards:</strong> Providing real-time performance insights for informed decision-making.</li>
</ul>
<p>By partnering with SEESL, businesses can transform their asset management strategies, moving from reactive repairs to intelligent, data-driven optimization. This not only safeguards critical infrastructure but also drives operational excellence and long-term profitability.</p>`,
    author_name: "George Samuel Etim",
    image_url:
      "https://images.pexels.com/photos/8439235/pexels-photo-8439235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: [
      "Asset Management",
      "Predictive Maintenance",
      "AI",
      "Industry 4.0",
      "Efficiency",
      "Cost Savings",
    ],
    published: true,
  },
  {
    title: "Unlocking Global Markets: Why ISO Certification is a Non-Negotiable for Nigerian Businesses",
    content: `<p>In an increasingly competitive global marketplace, Nigerian businesses are seeking ways to stand out, build trust, and demonstrate their commitment to quality. ISO certification is the gold standard for achieving this, providing a clear framework for excellence that resonates with partners and customers worldwide.</p><h3>What is ISO Certification?</h3><p>The International Organization for Standardization (ISO) develops and publishes international standards that ensure products, services, and systems are safe, reliable, and of high quality. Certifications like ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and ISO 45001 (Occupational Health and Safety) are not just badges; they are comprehensive business improvement tools.</p><blockquote>For any organization, the pursuit of quality is a journey, not a destination. ISO standards provide the roadmap for that journey, ensuring every step is deliberate, measured, and effective.</blockquote><h3>The Tangible Benefits for Your Business</h3><ul><li><strong>Enhanced Credibility:</strong> ISO certification is a universally recognized mark of quality, instantly boosting your company\'s reputation.</li><li><strong>Access to New Markets:</strong> Many international contracts and tenders require ISO certification as a prerequisite, opening doors to global opportunities.</li><li><strong>Improved Efficiency & Reduced Waste:</strong> The process-oriented approach of ISO standards helps streamline operations, reduce errors, and minimize waste, leading to significant cost savings.</li><li><strong>Increased Customer Satisfaction:</strong> By focusing on quality and consistency, you deliver better products and services, leading to happier, more loyal customers.</li></ul><h3>Your Partner in Certification: SEESL</h3><p>Navigating the path to certification can be complex. At Solution Energy and Engineering Services Ltd (SEESL), we simplify the process. Our accredited training and implementation services for ISO 9001, 14001, and 45001 empower your team with the knowledge and tools needed to achieve and maintain these prestigious standards. We don\'t just prepare you for an audit; we help you build a culture of continuous improvement.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/7551623/pexels-photo-7551623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["ISO Certification", "Quality Management", "ISO 9001", "Business Excellence", "Nigeria"],
    published: true,
  },
  {
    title: "Building the Future: Quality, Safety, and Innovation in Modern Civil Construction",
    content: `<p>Civil construction is more than just erecting structures; it\'s about laying the foundation for communities and economies to thrive. From robust road networks to state-of-the-art public buildings, quality construction is the bedrock of societal progress. In Nigeria\'s dynamic environment, the demand for durable, safe, and innovative infrastructure has never been higher.</p><h3>The Pillars of Quality Construction</h3><p>Delivering excellence in civil construction requires a multi-faceted approach focused on three core pillars:</p><ul><li><strong>Quality Materials & Workmanship:</strong> The longevity of any structure depends on the quality of its components and the skill of the hands that assemble them. There is no substitute for premium materials and expert craftsmanship.</li><li><strong>Unyielding Commitment to Safety:</strong> A safe construction site is a productive and ethical one. Adhering to strict safety protocols, like those outlined in ISO 45001, protects the workforce and ensures project integrity.</li><li><strong>Innovative Techniques:</strong> Embracing modern construction techniques and technologies leads to greater efficiency, better outcomes, and more sustainable projects.</li></ul><blockquote>The measure of a great construction project is not just how it looks upon completion, but how it stands the test of time, serving its community for decades to come.</blockquote><h3>SEESL\'s Construction Expertise</h3><p>At Solution Energy and Engineering Services Ltd (SEESL), our Civil Construction division is built on these principles. We bring a wealth of experience to a diverse range of projects, including:</p><ul><li><strong>Road and Bridge Construction:</strong> Creating vital transportation links that connect communities.</li><li><strong>Public and Commercial Buildings:</strong> Constructing edifices that are both functional and built to last.</li><li><strong>Water Channel and Drainage Systems:</strong> Engineering critical infrastructure for environmental management.</li></ul><p>Our integrated approach, combining meticulous project management with a deep understanding of the local landscape, ensures that every project we undertake is a testament to quality and durability, contributing positively to Nigeria\'s infrastructural development.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Civil Construction", "Infrastructure", "Nigeria", "Quality", "Safety", "Engineering"],
    published: true,
  },
  {
    title: "The Clear Alternative: Economic and Environmental Benefits of Gas Conversion Technology",
    content: `<p>As fuel costs continue to rise and environmental concerns grow, individuals and industries across Nigeria are seeking smarter, cleaner, and more cost-effective energy solutions. Gas conversion technology, which enables vehicles and generators to run on Compressed Natural Gas (CNG) or Liquefied Petroleum Gas (LPG), presents a powerful and practical alternative to traditional fuels.</p><h3>Why Make the Switch?</h3><p>The advantages of converting to gas are compelling and immediate:</p><ul><li><strong>Significant Cost Savings:</strong> Natural gas is substantially cheaper than petrol, leading to dramatic reductions in daily fuel expenditure for motorists and operational costs for businesses.</li><li><strong>Reduced Environmental Impact:</strong> CNG and LPG burn much cleaner than petrol or diesel, resulting in significantly lower emissions of harmful pollutants like carbon monoxide, nitrogen oxides, and particulate matter.</li><li><strong>Increased Engine Lifespan:</strong> As a cleaner fuel, gas reduces carbon buildup in the engine, which can lead to less wear and tear and a longer engine life.</li></ul><blockquote>Switching to natural gas isn\'t just a smart financial decision; it\'s a responsible environmental one. It\'s a practical step every individual and business can take towards a cleaner Nigeria.</blockquote><h3>Expert Conversion Services by SEESL</h3><p>A successful conversion depends entirely on the quality of the installation. At Solution Energy and Engineering Services Ltd (SEESL), we are leaders in providing safe, reliable, and efficient gas conversion services. Our certified technicians ensure that every installation meets the highest international safety standards, giving you peace of mind and optimal performance.</p><p>Whether you\'re a fleet operator looking to slash operational costs or an individual driver tired of high fuel prices, SEESL provides a seamless transition to a cheaper, cleaner fuel source. Embrace the future of energy today.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/6875733/pexels-photo-6875733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Gas Conversion", "CNG", "LPG", "Clean Energy", "Cost Savings", "Nigeria"],
    published: true,
  },
  {
    title: "The SEESL Advantage: More Than a Contractor, A Certified Partner",
    content: `<p>Choosing a partner for your critical engineering and energy projects is a decision that significantly impacts your operational success, budget, and timeline. You need more than just a contractor; you need a strategic ally dedicated to quality and professionalism. This is the SEESL Advantage.</p><h3>Our Core Philosophy</h3><p>Our commitment is not just to complete a project, but to deliver excellence at every stage. This philosophy is embedded in our ISO 9001:2015 certified quality management processes. We integrate quality, safety, and innovation into the very core of our operations, ensuring every client experiences a seamless, transparent, and professional journey from start to finish.</p><blockquote>When you partner with SEESL, you are choosing a company where quality is not an accident, but a result of intelligent effort and an unwavering commitment to international standards.</blockquote><h3>A Full Spectrum of Certified Services</h3><p>Our diverse service offerings are all delivered under the same banner of unmatched quality assurance. These include:</p><ul><li><strong>Engineering Services:</strong> From design to implementation, executed with precision.</li><li><strong>Procurement:</strong> Strategic sourcing that guarantees value and reliability.</li><li><strong>Asset Management:</strong> Maximizing the lifespan and efficiency of your critical assets.</li><li><strong>Renewable Energy:</strong> Future-proofing your energy needs with sustainable solutions.</li></ul><p>Experience the peace of mind that comes from working with a partner whose professionalism is certified and whose commitment to your success is absolute.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["SEESL Advantage", "ISO 9001", "Quality Assurance", "Engineering Excellence", "Professionalism"],
    published: true
  },
  {
    title: "Strategic Procurement: How Our ISO 9001 Process Delivers Maximum Value",
    content: `<p>In today\'s complex global supply chain, inefficient procurement can quickly lead to project delays, budget overruns, and compromised quality. At SEESL, we transform procurement from a potential liability into a strategic advantage. Our procurement services are meticulously designed to mitigate risk and maximize value for our clients.</p><h3>Beyond the Lowest Bid</h3><p>True value in procurement is about more than just the initial price tag. It\'s about the total cost of ownership, including reliability, longevity, and timely delivery. Our approach focuses on securing the best overall value, ensuring that the equipment and materials we source meet the highest standards of quality and performance.</p><blockquote>Effective procurement isn\'t about finding the cheapest price; it\'s about securing the best value and ensuring timely, reliable delivery. Our ISO 9001 certified process guarantees this.</blockquote><h3>The Power of a Certified Process</h3><p>Our ISO 9001 quality management system governs our entire procurement lifecycle. This certification ensures:</p><ul><li><strong>Transparent Supplier Vetting:</strong> We work only with reputable suppliers who meet our stringent quality criteria.</li><li><strong>Rigorous Quality Control:</strong> All materials and equipment are subject to thorough inspection and verification.</li><li><strong>Efficient Logistics:</strong> We manage the entire supply chain to ensure on-time delivery to your project site.</li><li><strong>Complete Traceability:</strong> Our documentation provides a clear audit trail, ensuring accountability and compliance.</li></ul><p>Partner with SEESL to turn your procurement challenges into a streamlined, cost-effective, and reliable component of your success.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/5903273/pexels-photo-5903273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Procurement", "Supply Chain", "Cost Savings", "Efficiency", "ISO 9001", "Value"],
    published: true
  },
  {
    title: "Safety First, Quality Always: Setting the Standard in Industrial Tank Cleaning",
    content: `<p>Industrial tank and vessel cleaning is a high-stakes operation where there is zero room for error. Safety and environmental responsibility are not just priorities; they are absolute necessities. A single misstep can lead to catastrophic equipment damage, environmental incidents, or serious injury.</p><h3>Certified for Your Peace of Mind</h3><p>At SEESL, we approach this critical task with the gravity it deserves. Our operations are strictly guided by our dual ISO 45001 (Occupational Health and Safety) and ISO 14001 (Environmental Management) certifications. This isn\'t just about compliance; it\'s about a deep-seated commitment to protecting our people, our clients\' assets, and the environment.</p><blockquote>We believe a clean environment and a safe workplace are not optional extras. They are the fundamental principles of responsible industry, and our ISO certifications are your guarantee of our commitment.</blockquote><h3>Our Methodology</h3><p>Our highly trained and certified crews utilize state-of-the-art, specialized equipment to ensure every job is performed to the highest standard. We focus on:</p><ul><li><strong>Comprehensive Risk Assessment:</strong> Identifying and mitigating all potential hazards before work begins.</li><li><strong>Use of Advanced Technology:</strong> Employing automated and remote cleaning systems to minimize human entry into confined spaces.</li><li><strong>Waste Management:</strong> Ensuring all hazardous materials are handled and disposed of in accordance with environmental regulations.</li></ul><p>Choose SEESL for your industrial cleaning needs and ensure the job is done right, safely, and responsibly.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/5774146/pexels-photo-5774146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Tank Cleaning", "Industrial Safety", "ISO 45001", "ISO 14001", "Environmental Responsibility"],
    published: true
  },
  {
    title: "Case Study: How We Solved a Critical Power Failure Issue for a Leading Manufacturer",
    content: `<p><strong>The Challenge:</strong> A leading Nigerian manufacturing firm was plagued by intermittent power failures from an unstable grid connection. These outages resulted in daily production losses averaging over ₦5 million and threatened their ability to meet customer deadlines.</p><p><strong>The Solution:</strong> SEESL\'s engineering division was contracted to design and implement a full-scale, resilient power infrastructure upgrade. Our process involved:</p><ol><li>A comprehensive on-site energy audit to identify critical failure points.</li><li>The design of a hybrid power system that integrated automated grid failover, backup generators, and a scalable solar power component.</li><li>Full project management of the installation, commissioning, and staff training.</li></ol><blockquote>This project perfectly illustrates our core capability: we diagnose complex engineering challenges and deliver innovative, practical solutions that provide immediate, measurable return on investment.</blockquote><p><strong>The Result:</strong> Within the first six months of operation, the new system resulted in a 99.9% reduction in production downtime caused by power issues and a 40% decrease in overall energy costs, thanks to the solar integration. The client achieved project payback in just 18 months. This is the tangible impact of SEESL\'s engineering expertise.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/157835/pexels-photo-157835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Engineering", "Case Study", "Power Generation", "Problem Solving", "Infrastructure", "ROI"],
    published: true
  },
  {
    title: "Beyond Compliance: How Our ISO 45001 Certification Cultivates a True Culture of Safety",
    content: `<p>For many companies in the industrial sector, safety is a matter of compliance—a box to be ticked to avoid penalties. At SEESL, we see it differently. For us, safety is our most deeply held corporate value, and our ISO 45001 certification in Occupational Health and Safety is the operational framework for this commitment, not the goal itself.</p><h3>What a Culture of Safety Looks Like</h3><p>An authentic safety culture, as fostered by our ISO 45001 system, means that:</p><ul><li>Every employee, from senior management to on-site technicians, is empowered and responsible for safety.</li><li>Proactive hazard identification and risk assessment are integrated into every project plan.</li><li>Continuous training and improvement are standard practice, not occasional events.</li><li>Near-misses are reported and analyzed transparently to prevent future incidents.</li></ul><blockquote>A project is only truly successful if it is completed without a single safety incident. That is our unwavering goal, and our ISO 45001 certification is the system that makes it possible.</blockquote><p>When you partner with SEESL, you are not just hiring a contractor. You are embedding a certified culture of safety into your project, protecting your assets, your reputation, and, most importantly, your people.</p>`,
    author_name: "George Samuel Etim",
    image_url: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["ISO 45001", "Safety Culture", "Occupational Health", "Zero Incidents", "Risk Management"],
    published: true
  }
];

async function seedBlogPosts() {
  if (!BLOG_ADMIN_API_KEY) {
    console.error("Error: BLOG_ADMIN_API_KEY is not set in .env");
    return;
  }

  for (const postData of blogPostsToSeed) {
    try {
      console.log(`Attempting to add post: "${postData.title}"...`);
      const response = await fetch(`${BACKEND_URL}/api/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": BLOG_ADMIN_API_KEY,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const result = await response.json();
      console.log(`Blog post "${result.title}" added successfully!`);
    } catch (error) {
      console.error(`Error adding blog post "${postData.title}":`, error);
    }
  }
}

seedBlogPosts();
