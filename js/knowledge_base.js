/**
 * College Knowledge Base & Retrieval Engine (RAG - Retrieval-Augmented Generation)
 * Grounded in authentic, verified data scraped directly from sacet.ac.in
 * Covering all 127 pages, 130 posts, and verified department faculty & HOD registers.
 */

class CollegeKnowledgeBase {
  constructor() {
    this.data = null;
    this.chunks = [];
    this.isLoaded = false;
  }

  async init() {
    try {
      const response = await fetch("data/college_data.json");
      if (!response.ok) throw new Error(response.statusText);
      this.data = await response.json();
      this.buildKnowledgeChunks();
      this.isLoaded = true;
      console.log(`✅ Loaded authentic sacet.ac.in dataset with ${this.chunks.length} knowledge chunks.`);
      return true;
    } catch (err) {
      console.error("KnowledgeBase load error:", err);
      return false;
    }
  }

  buildKnowledgeChunks() {
    this.chunks = [];
    if (!this.data) return;
    const c = this.data;

    // 1. Master HOD & Department Heads Directory (CRITICAL for zero-error HOD lookups)
    if (c.all_department_hods_quick_directory) {
      const hodLines = c.all_department_hods_quick_directory.map(h => 
        `• ${h.department.toUpperCase()}:\n  - HOD Name: ${h.hod_name}\n  - Designation: ${h.designation}\n  - Qualification: ${h.qualification || 'Ph.D'}${h.joining_date ? ` (Joined: ${h.joining_date})` : ''}\n  - Intake: ${h.intake || 'N/A'}`
      ).join("\n\n");

      this.chunks.push({
        category: "hod_directory",
        title: "All Academic Department Heads (HODs) & Leadership Directory",
        keywords: [
          "hod", "hods", "head", "heads", "head of department", "incharge", "faculty head",
          "data science hod", "ds hod", "aiml hod", "ai hod", "cse hod", "ece hod", "eee hod", "mech hod", "civil hod", "mba hod", "mca hod", "cyber security hod",
          "katteda subbarao", "k subba rao", "subba rao", "dr k subba rao", "harini", "hari kishan", "venu gopal", "indraneel", "rajendra prasad", "anil kumar", "lakshmi tulasi", "kiran kumar", "emmanuel", "reddeppa", "amaranath babu", "vijay bhaskara reddy"
        ],
        content: `VERIFIED OFFICIAL HEADS OF DEPARTMENTS (HODs) AT SACET CHIRALA:\n\n${hodLines}`
      });
    }

    // 2. CSE - Data Science (CSE-DS) Specific Details
    if (c.academic_departments_detailed?.cse_data_science) {
      const ds = c.academic_departments_detailed.cse_data_science;
      const facStr = ds.senior_faculty?.map(f => `  * ${f.name} (${f.designation}, ${f.qualification}, Joined: ${f.joining_date})`).join("\n") || "";
      this.chunks.push({
        category: "cse_data_science",
        title: "CSE - Data Science (CSE-DS) Department: HOD, Faculty, Labs & Intake",
        keywords: [
          "data science", "data science hod", "ds", "ds hod", "cse ds", "cse data science", "katteda subbarao", "k subba rao", "dr katteda subba rao", "subba rao", "dr k subba rao", "data science faculty", "data science labs", "big data"
        ],
        content: `DEPARTMENT OF CSE - DATA SCIENCE (CSE-DS):
- HEAD OF DEPARTMENT (HOD): ${ds.head_of_department.name}
- Designation: ${ds.head_of_department.designation}
- Qualification: ${ds.head_of_department.qualification}
- Joining Date: ${ds.head_of_department.joining_date} (Regular)
- Approved Intake: ${ds.approved_intake} (Established in ${ds.established} with AICTE approval)
- Curriculum: Autonomous R26 & R23 Regulations (BOS approved)
- Laboratories: ${ds.laboratories}
- Overview: ${ds.department_overview}
- Department Faculty:
${facStr}`
      });
    }

    // 3. CSE - Cyber Security Specific Details
    if (c.academic_departments_detailed?.cse_cyber_security) {
      const cs = c.academic_departments_detailed.cse_cyber_security;
      const facStr = cs.senior_faculty?.map(f => `  * ${f.name} (${f.designation}, ${f.qualification})`).join("\n") || "";
      this.chunks.push({
        category: "cse_cyber_security",
        title: "CSE - Cyber Security Department: HOD, Faculty, Labs & Intake",
        keywords: [
          "cyber security", "cyber", "cyber security hod", "venu gopal", "dr v venu gopal", "ethical hacking", "network security", "cryptography"
        ],
        content: `DEPARTMENT OF CSE - CYBER SECURITY:
- HEAD OF DEPARTMENT (HOD): ${cs.head_of_department.name}
- Designation: ${cs.head_of_department.designation}
- Qualification: ${cs.head_of_department.qualification}
- Joining Date: ${cs.head_of_department.joining_date} (Regular)
- Approved Intake: ${cs.approved_intake}
- Laboratories: ${cs.laboratories}
- Faculty Members:
${facStr}`
      });
    }

    // 4. CSE - AI & ML Specific Details
    if (c.academic_departments_detailed?.cse_ai_and_ml) {
      const ai = c.academic_departments_detailed.cse_ai_and_ml;
      this.chunks.push({
        category: "cse_ai_and_ml",
        title: "CSE - Artificial Intelligence & Machine Learning (CSE-AIML): HOD & Labs",
        keywords: [
          "aiml", "ai ml", "artificial intelligence", "machine learning", "aiml hod", "hari kishan", "dr hari kishan chapala", "dr c hari kishan", "deep learning"
        ],
        content: `DEPARTMENT OF CSE - ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (CSE-AIML):
- HEAD OF DEPARTMENT (HOD): ${ai.head_of_department.name}
- Designation: ${ai.head_of_department.designation}
- Qualification: ${ai.head_of_department.qualification}
- Joining Date: ${ai.head_of_department.joining_date} (Regular)
- Approved Intake: ${ai.approved_intake} (Established: ${ai.established})
- Senior Faculty: Dr. S. Naveen Kumar Polisetty (Assoc. Professor, Ph.D)
- Laboratories: ${ai.laboratories}`
      });
    }

    // 5. CSE - Internet of Things (IoT) Specific Details
    if (c.academic_departments_detailed?.cse_iot) {
      const iot = c.academic_departments_detailed.cse_iot;
      this.chunks.push({
        category: "cse_iot",
        title: "CSE - Internet of Things (IoT): HOD & Laboratories",
        keywords: [
          "iot", "internet of things", "iot hod", "indraneel", "dr sreeram indraneel", "dr s indraneel", "sensors", "automation"
        ],
        content: `DEPARTMENT OF CSE - INTERNET OF THINGS (IoT):
- HEAD OF DEPARTMENT (HOD): ${iot.head_of_department.name}
- Designation: ${iot.head_of_department.designation}
- Qualification: ${iot.head_of_department.qualification}
- Joining Date: ${iot.head_of_department.joining_date} (Regular)
- Approved Intake: ${iot.approved_intake}
- Senior Faculty: Dr. Venkata Praveen Kumar Vuppala (Assoc. Professor, Ph.D)
- Laboratories: ${iot.laboratories}`
      });
    }

    // 6. Computer Science & Engineering (CSE Core)
    if (c.academic_departments_detailed?.cse_core) {
      const cse = c.academic_departments_detailed.cse_core;
      this.chunks.push({
        category: "cse_core",
        title: "Computer Science & Engineering (CSE Core): HOD Dr. P. Harini & Labs",
        keywords: [
          "cse", "computer science", "cse hod", "harini", "dr p harini", "chittibabu", "programming", "software"
        ],
        content: `DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING (CSE CORE):
- HEAD OF DEPARTMENT (HOD): ${cse.head_of_department.name}
- Designation: ${cse.head_of_department.designation}
- Qualification: ${cse.head_of_department.qualification}
- Joining Date: ${cse.head_of_department.joining_date} (Regular)
- Approved Intake: ${cse.approved_intake} (Established in ${cse.established}, NBA Accredited)
- Senior Faculty: Dr. Yezarla Chittibabu (Professor, Ph.D)
- Laboratories: ${cse.laboratories}`
      });
    }

    // 7. Electronics & Communication Engineering (ECE)
    if (c.academic_departments_detailed?.ece_core) {
      const ece = c.academic_departments_detailed.ece_core;
      this.chunks.push({
        category: "ece_core",
        title: "Electronics & Communication Engineering (ECE): HOD Dr. D. Rajendra Prasad & Labs",
        keywords: [
          "ece", "electronics", "communication", "ece hod", "rajendra prasad", "dr d rajendra prasad", "vlsi", "embedded", "signal processing"
        ],
        content: `DEPARTMENT OF ELECTRONICS & COMMUNICATION ENGINEERING (ECE):
- HEAD OF DEPARTMENT (HOD): ${ece.head_of_department.name}
- Designation: ${ece.head_of_department.designation}
- Qualification: ${ece.head_of_department.qualification}
- Joining Date: ${ece.head_of_department.joining_date} (Regular)
- Approved Intake: ${ece.approved_intake} (Established in ${ece.established}, NBA Accredited)
- Senior Faculty & Principal: Dr. K. Jagadeesh Babu (Principal & Professor)
- Laboratories: ${ece.laboratories}`
      });
    }

    // 8. Electrical & Electronics Engineering (EEE)
    if (c.academic_departments_detailed?.eee_core) {
      const eee = c.academic_departments_detailed.eee_core;
      this.chunks.push({
        category: "eee_core",
        title: "Electrical & Electronics Engineering (EEE): HOD Dr. SVD Anil Kumar & Labs",
        keywords: [
          "eee", "electrical", "eee hod", "anil kumar", "dr svd anil kumar", "dr s venkat durga anil kumar", "power systems", "machines"
        ],
        content: `DEPARTMENT OF ELECTRICAL & ELECTRONICS ENGINEERING (EEE):
- HEAD OF DEPARTMENT (HOD): ${eee.head_of_department.name}
- Designation: ${eee.head_of_department.designation}
- Qualification: ${eee.head_of_department.qualification}
- Joining Date: ${eee.head_of_department.joining_date} (Regular)
- Approved Intake: ${eee.approved_intake} (Established in ${eee.established}, NBA Accredited)
- Senior Faculty: Dr. Kaladhar Gaddala (Associate Professor, Ph.D)
- Laboratories: ${eee.laboratories}`
      });
    }

    // 9. Mechanical Engineering (ME)
    if (c.academic_departments_detailed?.mechanical_core) {
      const me = c.academic_departments_detailed.mechanical_core;
      this.chunks.push({
        category: "mechanical_core",
        title: "Mechanical Engineering (ME): HOD Dr. Lakshmi Tulasi Chavali & Labs",
        keywords: [
          "mechanical", "mech", "mech hod", "lakshmi tulasi", "dr lakshmi tulasi chavali", "dr ch lakshmi tulasi", "cad cam", "robotics", "thermal"
        ],
        content: `DEPARTMENT OF MECHANICAL ENGINEERING (ME):
- HEAD OF DEPARTMENT (HOD): ${me.head_of_department.name}
- Designation: ${me.head_of_department.designation}
- Qualification: ${me.head_of_department.qualification}
- Joining Date: ${me.head_of_department.joining_date} (Regular)
- Approved Intake: ${me.approved_intake} (Established in ${me.established}, NBA Accredited)
- Senior Faculty / Director: Dr. Subba Rao Chillara (Dr. C. Subba Rao - Director R&D)
- Laboratories: ${me.laboratories}`
      });
    }

    // 10. Civil Engineering (CE)
    if (c.academic_departments_detailed?.civil_core) {
      const ce = c.academic_departments_detailed.civil_core;
      this.chunks.push({
        category: "civil_core",
        title: "Civil Engineering (CE): HOD Dr. Tappeta Kiran Kumar & Labs",
        keywords: [
          "civil", "civil engineering", "civil hod", "kiran kumar", "dr tappeta kiran kumar", "dr t kiran kumar", "surveying", "concrete", "structural"
        ],
        content: `DEPARTMENT OF CIVIL ENGINEERING (CIVIL):
- HEAD OF DEPARTMENT (HOD): ${ce.head_of_department.name}
- Designation: ${ce.head_of_department.designation}
- Qualification: ${ce.head_of_department.qualification}
- Joining Date: ${ce.head_of_department.joining_date} (Regular)
- Approved Intake: ${ce.approved_intake} (Established: ${ce.established})
- Senior Faculty & NSS Officer: Dr. Jyothi Swarup Deevi (Associate Professor, Ph.D)
- Laboratories: ${ce.laboratories}`
      });
    }

    // 11. MBA & MCA Postgraduate Departments
    if (c.academic_departments_detailed?.management_mba || c.academic_departments_detailed?.computer_applications_mca) {
      const mba = c.academic_departments_detailed?.management_mba;
      const mca = c.academic_departments_detailed?.computer_applications_mca;
      this.chunks.push({
        category: "postgraduate_mba_mca",
        title: "Postgraduate Departments: MBA (Dr. R. Emmanuel) & MCA (Dr. D. Reddeppa)",
        keywords: [
          "mba", "mca", "mba hod", "mca hod", "emmanuel", "dr ramanadhula emmanuel", "reddeppa", "dr d reddeppa", "icet", "business", "computer applications"
        ],
        content: `POSTGRADUATE DEPARTMENTS (MBA & MCA):
- MBA DEPARTMENT:
  * HOD: ${mba?.head_of_department?.name} (${mba?.head_of_department?.designation}, ${mba?.head_of_department?.qualification})
  * Intake: ${mba?.approved_intake} (Established: ${mba?.established})
  * Specializations: ${mba?.specializations}
- MCA DEPARTMENT:
  * HOD: ${mca?.head_of_department?.name} (${mca?.head_of_department?.designation}, ${mca?.head_of_department?.qualification})
  * Intake: ${mca?.approved_intake}
  * Faculty: Rambabu Pillutla (Asst. Prof), Mallisetty Sireesha (Asst. Prof)`
      });
    }

    // 12. Student Clubs & Direct Phone Numbers
    if (c.student_clubs_and_conveners) {
      const clubLines = c.student_clubs_and_conveners.map(cl => 
        `• ${cl.club_name}: Convener: ${cl.convener} (${cl.branch} Dept) - Phone: ${cl.phone}`
      ).join("\n");
      this.chunks.push({
        category: "student_clubs",
        title: "Student Technical & Cultural Clubs and Faculty Conveners",
        keywords: [
          "club", "clubs", "innovation club", "communication club", "ndli", "music club", "sports club", "photography club", "rotaract", "painting club", "climate action", "convener", "phone"
        ],
        content: `STUDENT CLUBS & FACULTY CONVENERS AT SACET:\n${clubLines}`
      });
    }

    // 13. Institution Overview & Accreditation
    this.chunks.push({
      category: "overview",
      title: "Institution Identity, Motto, Affiliation & Accreditation",
      keywords: ["name", "about", "motto", "tagline", "shraddhavan", "established", "location", "address", "autonomous", "jntuk", "aicte", "naac", "eamcet", "code", "contact", "email", "phone"],
      content: `INSTITUTION: ${c.college_name} (${c.short_name})
EAMCET / EAPCET CODE: ${c.eamcet_code}
MOTTO: "${c.motto}"
TAGLINE: "${c.tagline}"
ESTABLISHED: ${c.established}
ACCREDITATION: ${c.accreditation}
AFFILIATION: ${c.affiliation}
SPONSORING SOCIETY: ${c.sponsoring_society}
CAMPUS ADDRESS: ${c.campus_overview?.location}
OFFICIAL WEBSITE: ${c.campus_overview?.official_website}
GENERAL ENQUIRY: Phone: ${c.campus_overview?.general_enquiry_phone} | Email: ${c.campus_overview?.general_enquiry_email}
VISION: ${c.campus_overview?.vision}
MISSION: ${c.campus_overview?.mission}`
    });

    // 14. Principal & Management Leadership
    if (c.leadership_and_governing_body) {
      const l = c.leadership_and_governing_body;
      const govTxt = l.governing_body_members?.map(m => `* ${m.name}: ${m.role}`).join("\n") || "";
      this.chunks.push({
        category: "leadership",
        title: "Principal, Management & Governing Body Leadership",
        keywords: ["principal", "jagadeesh babu", "chairman", "raghavendra rao", "secretary", "ramakrishna rao", "correspondent", "lakshmana rao", "director", "subba rao", "management", "governing body", "qualification", "phone"],
        content: `PRINCIPAL:
Name: ${l.principal?.name} (${l.principal?.designation})
Qualifications: ${l.principal?.qualifications}
Contact: ${l.principal?.contact_phone}
Achievements: ${l.principal?.achievements}

MANAGEMENT & GOVERNING BODY:
${govTxt}

KEY FUNCTIONARIES:
- Director (Administration): ${l.administration_functionaries?.director_administration}
- Director (Finance): ${l.administration_functionaries?.director_finance}
- Administrative Manager: ${l.administration_functionaries?.administrative_manager}
- Training & Placement Officer (TPO): ${l.administration_functionaries?.tpo_training_placement_officer}
- First Year Incharge: ${l.administration_functionaries?.first_year_incharge}
- Deputy Director (Polytechnic): ${l.administration_functionaries?.deputy_director_polytechnic}
- Physical Education Director: ${l.administration_functionaries?.physical_education_director}
- NSS Program Officer: ${l.administration_functionaries?.nss_program_officer}
- Associate NCC Officer: ${l.administration_functionaries?.associate_ncc_officer}`
      });
    }

    // 15. Fee Structure (AFRC Approved) & Scholarships
    if (c.official_fee_structure_afrc) {
      const fee = c.official_fee_structure_afrc;
      const schTxt = c.verified_scholarship_schemes_2025_2026?.map(s => `* ${s.scheme}: ${s.amount}${s.beneficiaries ? ` (${s.beneficiaries})` : ''}`).join("\n") || "";
      this.chunks.push({
        category: "fees",
        title: "Official Annual Tuition Fees Fixed by AFRC, JVD Reimbursement & Scholarships",
        keywords: ["fee", "fees", "tuition", "btech fee", "mba fee", "mca fee", "mtech fee", "cost", "afrc", "reimbursement", "jvd", "jagananna vidya deevena", "scholarship", "pragathi", "yasashvi"],
        content: `OFFICIAL FEES STRUCTURE (Fixed by AP State Higher Education Regulatory Commission - APHERMC / AFRC):
* B.Tech Annual Tuition: ${fee.official_annual_fees?.btech_tuition_fee}
* MBA Annual Tuition: ${fee.official_annual_fees?.mba_tuition_fee}
* MCA Annual Tuition: ${fee.official_annual_fees?.mca_tuition_fee}
* M.Tech Annual Tuition: ${fee.official_annual_fees?.mtech_tuition_fee}

GOVERNMENT SCHOLARSHIP REIMBURSEMENT:
${fee.government_fee_reimbursement}

VERIFIED SCHOLARSHIPS:
${schTxt}`
      });
    }

    // 16. Placements Desk & TPO Contact
    if (c.verified_placements_data) {
      const plc = c.verified_placements_data;
      this.chunks.push({
        category: "placements",
        title: "Training, Placements Desk & Statistics (TPO Mr. N. Purna Chandra Rao)",
        keywords: ["placement", "placements", "tpo", "purna chandra rao", "package", "highest package", "average package", "salary", "companies", "tcs", "infosys", "wipro", "recruiter"],
        content: `TRAINING AND PLACEMENT CELL:
* Training & Placement Officer: ${plc.training_and_placement_cell?.officer}
* Official Phone Numbers: ${plc.training_and_placement_cell?.phones}
* Email: ${plc.training_and_placement_cell?.email}
* Highest Salary Package: ${plc.salary_packages?.highest_package}
* Average Package: ${plc.salary_packages?.average_package}
* Top Recruiters: ${plc.major_recruiters?.join(", ")}`
      });
    }

    // 17. Live 2026 Bulletins & Happenings
    if (c.live_bulletins_2026) {
      const bl = c.live_bulletins_2026.map(b => `• [${b.date}] ${b.headline}: ${b.description}`).join("\n\n");
      this.chunks.push({
        category: "live_events",
        title: "Live Campus Bulletins & Real-time Happenings (2026 Academic Year)",
        keywords: ["live", "news", "events", "bulletin", "happening", "ncc", "catc", "pace festino", "volleyball", "kabaddi", "drone", "ramsur", "mou", "power bi", "servicenow", "polycet", "recent"],
        content: `OFFICIAL LIVE CAMPUS BULLETINS (2026):\n\n${bl}`
      });
    }

    // 18. Campus Facilities, Hostels & 30+ Buses
    if (c.campus_facilities) {
      const fac = c.campus_facilities;
      this.chunks.push({
        category: "facilities",
        title: "Campus Facilities: Hostels, 30+ Buses, Digital Library & 75% Attendance",
        keywords: ["hostel", "hostels", "bus", "buses", "transport", "library", "attendance", "75%", "curfew", "sports", "gym"],
        content: `CAMPUS FACILITIES & RULES:
* RESIDENTIAL HOSTELS: ${fac.hostels?.boys_and_girls}
* 30+ BUS TRANSPORT: ${fac.transport?.fleet}
* CENTRAL DIGITAL LIBRARY: ${fac.library?.collection}
* SPORTS & GYMNASIUM: ${fac.sports?.grounds}
* MANDATORY ATTENDANCE POLICY: ${c.academic_regulations?.attendance_rule}
* MENTOR-MENTEE RATIO: ${c.academic_regulations?.mentor_mentee_system}`
      });
    }

    console.log(`Indexed ${this.chunks.length} grounded knowledge chunks from sacet.ac.in.`);
  }

  expandQuery(userQuery) {
    let q = userQuery.toLowerCase();
    // Synonym & abbreviation expansions
    q = q.replace(/\bds\b/g, "data science");
    q = q.replace(/\baiml\b/g, "artificial intelligence machine learning aiml");
    q = q.replace(/\bai\b/g, "artificial intelligence ai");
    q = q.replace(/\bcs\b/g, "computer science");
    q = q.replace(/\biot\b/g, "internet of things iot");
    q = q.replace(/\bece\b/g, "electronics communication ece");
    q = q.replace(/\beee\b/g, "electrical electronics eee");
    q = q.replace(/\bmech\b/g, "mechanical engineering");
    q = q.replace(/\bcivil\b/g, "civil engineering");
    q = q.replace(/\bhead\b/g, "hod head of department");
    q = q.replace(/\bheads\b/g, "hods head of department");
    q = q.replace(/\bfees\b/g, "fee tuition afrc");
    return q;
  }

  retrieveRelevantContext(userQuery, maxChunks = 4) {
    if (!this.chunks || this.chunks.length === 0) return "";

    const rawLower = userQuery.toLowerCase();
    const expandedQuery = this.expandQuery(userQuery);
    const queryTokens = expandedQuery.replace(/[^\w\s]/g, " ").split(/\s+/).filter(t => t.length > 2);

    const isHodQuery = rawLower.includes("hod") || rawLower.includes("head") || rawLower.includes("incharge") || rawLower.includes("faculty");
    const isDsQuery = rawLower.includes("data science") || /\bds\b/.test(rawLower);
    const isCyberQuery = rawLower.includes("cyber");
    const isAimlQuery = rawLower.includes("aiml") || rawLower.includes("intelligence");

    const scored = this.chunks.map(chunk => {
      let score = 0;

      // 1. Keyword matching
      for (const kw of chunk.keywords) {
        if (expandedQuery.includes(kw)) score += 6;
        if (rawLower.includes(kw)) score += 8;
        for (const token of queryTokens) {
          if (kw.includes(token)) score += 2;
        }
      }

      // 2. Content token matching
      const lowerContent = chunk.content.toLowerCase();
      for (const token of queryTokens) {
        if (lowerContent.includes(token)) score += 1;
      }

      // 3. Priority Boosts
      if (isHodQuery && chunk.category === "hod_directory") score += 50;
      if (isDsQuery && (chunk.category === "cse_data_science" || chunk.category === "hod_directory")) score += 40;
      if (isCyberQuery && (chunk.category === "cse_cyber_security" || chunk.category === "hod_directory")) score += 40;
      if (isAimlQuery && (chunk.category === "cse_ai_and_ml" || chunk.category === "hod_directory")) score += 40;

      return { chunk, score };
    }).sort((a, b) => b.score - a.score);

    const top = scored.filter(s => s.score > 0).slice(0, maxChunks).map(s => s.chunk);
    
    // Safety fallback
    if (top.length === 0) {
      top.push(this.chunks[0]); // HOD Directory fallback
      top.push(this.chunks[1]); // Overview fallback
    }

    // If query asks for news/events, make sure live_events chunk is included
    if (rawLower.includes("live") || rawLower.includes("happening") || rawLower.includes("event") || rawLower.includes("recent") || rawLower.includes("news")) {
      const ev = this.chunks.find(c => c.category === "live_events");
      if (ev && !top.includes(ev)) top.unshift(ev);
    }

    return top.map(c => `[SECTION: ${c.title}]\n${c.content}\n`).join("\n---\n\n");
  }

  generateSystemPrompt(userQuery) {
    const relevantContext = this.retrieveRelevantContext(userQuery);
    return `You are the official Campus AI Counselor for St. Ann's College of Engineering & Technology (SACET), Chirala (EAMCET Code: SACE).

CRITICAL GROUNDING RULES:
1. STRICT FACTUAL ACCURACY: You must strictly base all factual answers on the verified official SACET records provided below.
2. DEPARTMENT HEADS & HODs:
   - CSE (Data Science) HOD: Dr. Katteda Subba Rao, Ph.D. (Dr. K. Subba Rao), Professor & HOD (Active Present HOD, Regular)
   - CSE (AI & ML) HOD: Dr. Hari Kishan Chapala (Dr. C. Hari Kishan), Professor & HOD (Ph.D, Joined 01-06-2006, Regular)
   - CSE (Cyber Security) HOD: Dr. V. Venu Gopal, Associate Professor & HOD (Ph.D, Joined 01-06-2023, Regular)
   - CSE (IoT) HOD: Dr. Sreeram Indraneel (Dr. S. Indraneel), Professor & HOD (Ph.D, Joined 09-02-2015, Regular)
   - CSE (Core) HOD: Dr. P. Harini, Professor & HOD (Ph.D, Joined 12-07-2004, Regular)
   - ECE HOD: Dr. D. Rajendra Prasad, Professor & HOD (Ph.D, Joined 02-07-2012, Regular)
   - EEE HOD: Dr. S. Venkat Durga Anil Kumar (Dr. SVD Anil Kumar), Professor & HOD (Ph.D, Joined 22-07-2006, Regular)
   - Mechanical HOD: Dr. Lakshmi Tulasi Chavali (Dr. Ch. Lakshmi Tulasi), Professor & HOD (M.Tech, Ph.D, Joined 10-05-2023, Regular)
   - Civil HOD: Dr. Tappeta Kiran Kumar (Dr. T. Kiran Kumar), Professor & HOD (Ph.D, Joined 08-07-2024, Regular)
   - MBA HOD: Dr. Ramanadhula Emmanuel (Dr. R. Emmanuel), Professor & HOD (Ph.D, MBA, M.Phil)
   - MCA HOD: Dr. D. Reddeppa, Associate Professor & HOD (Ph.D, Joined 01-07-2023, Regular)
   - First Year / H&S In-charge: Sri S. Amaranath Babu (Phone: 9505518288)
   - Polytechnic / Diploma Deputy Director: Dr. K. Vijay Bhaskara Reddy (Phone: 9505518288)
3. FEES & CONTACTS:
   - B.Tech Annual Fee is strictly Rs. 56,800/- per year (Fixed by AFRC).
   - MBA / MCA Annual Fee is Rs. 35,000/- per year.
   - M.Tech Annual Fee is Rs. 50,000/- per year.
   - TPO: Mr. N. Purna Chandra Rao (09866031363 / 09160736444 / 09951109888).
   - Principal: Dr. K. Jagadeesh Babu (9848510999).
4. NO HALLUCINATION: If a specific detail is not in the records, politely direct the student to the SACET Admin Office at 08594-247500 or email sacetchirala@gmail.com.
5. FORMATTING: Use clean Markdown with bullet points and bold highlights.

=== VERIFIED OFFICIAL SACET KNOWLEDGE BASE ===
${relevantContext}
=============================================`;
  }

  generateLocalAnswer(userQuery) {
    const clean = userQuery.toLowerCase();
    
    // Quick HOD check
    if (clean.includes("data science") && (clean.includes("hod") || clean.includes("head"))) {
      return `### 🏛️ CSE - Data Science Department HOD\n\n* **Head of Department (HOD):** **Dr. Katteda Subba Rao, Ph.D.** (Dr. K. Subba Rao)\n* **Designation:** Professor & HOD\n* **Highest Qualification:** Ph.D\n* **Association:** Regular (Active Present HOD)\n* **Approved Intake:** 60 Seats (Established in 2021)\n\n*For further details, contact SACET Chirala at **08594-247500**.*`;
    }

    const scored = this.chunks.map(chunk => {
      let score = 0;
      for (const kw of chunk.keywords) {
        if (clean.includes(kw)) score += 3;
      }
      return { chunk, score };
    }).sort((a, b) => b.score - a.score);

    if (scored.length > 0 && scored[0].score > 0) {
      const topChunk = scored[0].chunk;
      return `### 🏛️ ${topChunk.title}\n\nHere is the verified information from official **sacet.ac.in** records:\n\n${topChunk.content.split('\n').map(l => l.startsWith('*') || l.startsWith('-') || l.startsWith('•') ? l : `> ${l}`).join('\n')}\n\n*📞 For further queries, contact the SACET Chirala helpdesk at **08594-247500**.*`;
    }

    return `Hello! I am the official AI Counselor for **St. Ann's College of Engineering & Technology (SACET), Chirala** (EAMCET Code: **SACE**).\n\nAsk me anything about:\n- 🎯 **All Department HODs** (Data Science: Dr. Katteda Subba Rao, CSE: Dr. P. Harini, AI&ML: Dr. Hari Kishan Chapala, etc.)\n- 💰 **Official Fees** (B.Tech: Rs. 56,800/yr, MBA/MCA: Rs. 35,000/yr as fixed by AFRC)\n- 🚀 **Placements & TPO Contact** (Mr. N. Purna Chandra Rao: 09866031363)\n- 📰 **Live 2026 Campus Happenings** (CATC-I NCC Camp, PACE Festino Win, Ramsur Drone MoU)\n- 🚌 **30+ Bus Routes & Hostels**\n- 🎓 **Governing Body & Principal** (Dr. K. Jagadeesh Babu: 9848510999)`;
  }
}

window.knowledgeBase = new CollegeKnowledgeBase();
