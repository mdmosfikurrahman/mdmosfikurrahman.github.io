import { motion } from "framer-motion";

const PublicationsSection = () => {
  const journals = [
    {
      authors: "Rahman, M.M.*, Saifuzzaman, M., Ahmed, A., Mahin, M.F.M., & Shetu, S.F.",
      title: "Impact of COVID-19 on mental health: A quantitative analysis of anxiety and depression based on regular life and internet use",
      venue: "Current Research in Behavioral Sciences, 2, 100037",
      year: 2021,
      doi: "10.1016/j.crbeha.2021.100037",
    },
    {
      authors: "Saifuzzaman, M., Rahman, M.M., Shetu, S.F., & Moon, N.N.",
      title: "COVID-19 and Bangladesh: Situation report, comparative analysis, and case study",
      venue: "Current Research in Behavioral Sciences, 2, 100034",
      year: 2021,
      doi: "10.1016/j.crbeha.2021.100034",
    },
    {
      authors: "Shetu, S.F., Rahman, M.M., Ahmed, A., Mahin, M.F.M., Akib, M.A.U., & Saifuzzaman, M.",
      title: "Impactful e-learning framework: A new hybrid form of education",
      venue: "Current Research in Behavioral Sciences, 2, 100038",
      year: 2021,
      doi: "10.1016/j.crbeha.2021.100038",
    },
  ];

  const conferences = [
    {
      authors: "Rahman, M.M., Kashem, M.A., Mohiuddin, M., Hossain, M.A., & Moon, N.N.",
      title: "Future City of Bangladesh: IoT Based Autonomous Smart Sewerage and Hazard Condition Sharing System",
      venue: "IEEE WIECON-ECE 2020, pp. 126–130",
      year: 2020,
      doi: "10.1109/WIECON-ECE52138.2020.9397950",
      note: "🏆 Best Paper Award",
    },
    {
      authors: "Moon, N.N., Sharmin, S., Hossain, R.A., Jahan, I., Nur, F.N., & Rahman, M.M.",
      title: "Deep Learning Model for Detecting and Diagnosing Plant Disease",
      venue: "IEEE SMART GENCON 2021, pp. 1–8",
      year: 2021,
      doi: "10.1109/SMARTGENCON51891.2021.9645857",
    },
    {
      authors: "Rahman, M.M., Foysal, M.R., Moon, N.N., & Nur, F.N.",
      title: "TraFoo: An Android Application for Food Delivery in Train",
      venue: "IEEE SMART GENCON 2021, pp. 1–7",
      year: 2021,
      doi: "10.1109/SMARTGENCON51891.2021.9645900",
    },
    {
      authors: "Yesmin, F., Rahman, M.M., Saifuzzaman, M., & Moon, N.N.",
      title: "Pandemic Effect on Education System Among University Students",
      venue: "Springer — Progresses in AI & Robotics, pp. 157–168",
      year: 2022,
      doi: "10.1007/978-3-030-98531-8_16",
    },
    {
      authors: "Islam, T., Rahman, M.M., Jabiullah, M.I., & Saifuzzaman, M.",
      title: "Cyber Security Intruder Detection Using Deep Learning Approach",
      venue: "Springer — Information Systems and Management Science, pp. 518–530",
      year: 2023,
      doi: "10.1007/978-3-031-13150-9_42",
    },
    {
      authors: "Johora, F.T., Alamin-Ul-Islam, Yesmin, F., & Rahman, M.M.",
      title: "A New Chaotic-Based Analysis of Data Encryption and Decryption",
      venue: "Springer — Advances in Data Science and AI, pp. 455–468",
      year: 2023,
      doi: "10.1007/978-3-031-16178-0_32",
    },
    {
      authors: "Johora, F.T., Mahfuja, I.B., Rahman, A.N.M.M., Rahman, M.M., & Rahman, M.S.",
      title: "Machine Learning-Based Prediction of COVID-19: A Robust Approach for Early Diagnosis and Treatment",
      venue: "Springer — TCCE 2024, pp. 205–215",
      year: 2024,
      doi: "10.1007/978-981-97-1923-5_16",
    },
  ];

  const renderPub = (pub: typeof journals[0] & { note?: string }, i: number) => (
      <motion.li
          key={pub.doi}
          className="pl-5 py-4 border-l border-border hover:border-accent transition-all"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
      >
        {/* Award */}
        {pub.note && (
            <span className="inline-block text-[11px] font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full mb-2">
          {pub.note}
        </span>
        )}

        {/* Title */}
        <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
          {pub.title}
        </p>

        {/* Authors */}
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {pub.authors}
        </p>

        {/* Venue */}
        <p className="text-xs text-muted-foreground mt-1">
          <span className="italic">{pub.venue}</span>, {pub.year}
        </p>

        {/* DOI */}
        <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline mt-2 inline-block"
        >
          View Paper →
        </a>
      </motion.li>
  );

  return (
      <section id="publications" className="section-padding max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
          <p className="section-label">Publications</p>

          <h2 className="section-title">Publication List</h2>

          <p className="section-desc max-w-2xl">
            3 journal articles (Elsevier) and 7 conference papers (IEEE, Springer) — all peer-reviewed.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-12">

          {/* Journals */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border">
              Peer-Reviewed Journal Articles
            </h3>

            <ul className="space-y-3">
              {journals.map(renderPub)}
            </ul>
          </div>

          {/* Conferences */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border">
              Conference Proceedings
            </h3>

            <ul className="space-y-3">
              {conferences.map(renderPub)}
            </ul>
          </div>

        </div>
      </section>
  );
};

export default PublicationsSection;