import {motion} from "framer-motion";
import {ExternalLink} from "lucide-react";

interface PaperDetail {
    id: string;
    title: string;
    authors: string;
    venue: string;
    year: number;
    doi: string;
    type: "journal" | "conference";
    award?: string;
    abstract: string;
    keywords: string[];
    problem: string;
    solution: string;
    challenges: string;
    methodology: string;
    keyFindings: string;
    impact: string;
}

const papers: PaperDetail[] = [
    {
        id: "COVID19_MentalHealth_BD_2021",

        title: "Impact of COVID-19 on mental health: A quantitative analysis of anxiety and depression based on regular life and internet use",

        authors: "Md. Mosfikur Rahman, Mohd. Saifuzzaman, Akash Ahmed, Mahfuja Ferdousi Mahin, Syeda Farjana Shetu",

        venue: "Current Research in Behavioral Sciences, Elsevier",

        year: 2021,

        doi: "10.1016/j.crbeha.2021.100037",

        type: "journal",

        problem: "COVID-19 disrupted daily life and increased psychological distress, but lacked quantitative analysis linking lifestyle changes, internet use, and mental health in Bangladesh.",

        solution: "Conducted a survey-based quantitative study combining lifestyle, internet usage, and psychological indicators using statistical analysis and visualization.",

        challenges: "Limited sample diversity, student-heavy responses, and self-reported data introduce bias and limit generalization.",

        abstract: "This study analyzes the impact of COVID-19 on mental health in Bangladesh using survey data from 350 participants. It examines depression, anxiety, and behavioral changes in relation to internet usage and daily lifestyle. Results show that 42.78% of participants experienced depression, with higher prevalence among females. Increased internet use, reduced outdoor activity, and disrupted routines were key contributors. The study also identifies issues such as lack of concentration, irritability, and fatigue. Overall, findings reveal a strong association between prolonged internet use and declining psychological well-being during lockdown.",

        keywords: [
            "COVID-19",
            "Mental Health",
            "Depression",
            "Internet Usage",
            "Psychological Impact"
        ],

        methodology: "Collected 350 survey responses and converted qualitative data into quantitative form. Applied statistical analysis and visualizations (pie and count plots) to examine depression, internet use, and psychological changes.",

        keyFindings: "42.78% of participants were depressed, with higher rates among females. Internet overuse and reduced social activity strongly correlated with mental health decline.",

        impact: "Highlights the link between digital behavior and mental health, supporting awareness and intervention strategies during pandemics."
    },
    {
        id: "COVID19_BD_Situation_Analysis_2021",

        title: "COVID-19 and Bangladesh: Situation report, comparative analysis, and case study",

        authors: "Mohd Saifuzzaman, Md. Mosfikur Rahman, Syeda Farjana Shetu, Nazmun Nessa Moon",

        venue: "Current Research in Behavioral Sciences, Elsevier",

        year: 2021,

        doi: "10.1016/j.crbeha.2021.100034",

        type: "journal",

        problem: "COVID-19 created widespread health, economic, and social disruptions in Bangladesh, but lacked integrated analysis combining national trends, global comparisons, and real-world case studies.",

        solution: "The study integrates statistical analysis, data visualization, and case studies to present a comprehensive situation report and comparative analysis of COVID-19 in Bangladesh and other countries.",

        challenges: "Data collected from multiple sources may vary in accuracy, while case studies from media reports introduce subjectivity and limit empirical validation.",

        abstract: "This study presents a comprehensive analysis of COVID-19 in Bangladesh through statistical reporting, comparative analysis, and case studies. Data were collected from multiple authentic sources covering infection rates, deaths, testing, quarantine, and demographic distributions. The study analyzes national trends and compares Bangladesh with highly affected countries such as the USA, Brazil, Italy, China, and Russia. Visualization techniques are used to highlight patterns in infection spread, mortality, and recovery. Division-wise analysis shows Dhaka as the most affected region due to high population density, while Chittagong exhibits a higher death percentage. Age-based analysis indicates higher mortality among older populations, and gender analysis reveals higher male death rates. Additionally, case studies from media sources highlight the pandemic’s impact on education, economy, politics, and mental health. Overall, the findings provide a multi-dimensional understanding of COVID-19’s impact in Bangladesh and its global context.",

        keywords: [
            "COVID-19",
            "Bangladesh",
            "Comparative Analysis",
            "Data Visualization",
            "Case Study"
        ],

        methodology: "Collected datasets from multiple authentic sources including national COVID-19 statistics, quarantine data, demographic reports, and global comparisons. Data were structured, cleaned, validated, and analyzed using visualization techniques such as line plots and comparative charts. Algorithms were applied for both individual and comparative analysis across divisions and countries.",

        keyFindings: "Dhaka showed highest infection rates, while Chittagong had higher death percentage. Older age groups and males were more affected, and Bangladesh trends differed from global patterns in growth and mortality.",

        impact: "Provides a comprehensive data-driven overview of COVID-19 in Bangladesh, supporting policy analysis, awareness, and future pandemic preparedness."
    },

    {
        id: "Impactful_Elearning_Framework_2021",

        title: "Impactful e-learning framework: A new hybrid form of education",

        authors: "Syeda Farjana Shetu, Md. Mosfikur Rahman, Akash Ahmed, Mahfuja Ferdousi Mahin, Md. Abtab Uddin Akib, Mohd. Saifuzzaman",

        venue: "Current Research in Behavioral Sciences, Elsevier",

        year: 2021,

        doi: "10.1016/j.crbeha.2021.100038",

        type: "journal",

        problem: "Traditional education systems struggle to adapt to digital environments, especially in regions with network limitations, lacking a unified framework that supports both online and offline learning effectively.",

        solution: "Proposes a hybrid e-learning framework integrating online and offline learning, cloud-based storage, and role-based access for students, teachers, and administrators.",

        challenges: "Network instability, system scalability, and integrating offline access with online assessments pose key implementation challenges in real-world environments.",

        abstract: "This study proposes an impactful hybrid e-learning framework designed to improve digital education systems by integrating both online and offline learning approaches. The model addresses limitations of traditional and fully online systems, particularly in regions with network constraints. It introduces a structured architecture consisting of a web portal, central database, and role-based access for students, teachers, and administrators. The system supports course management, resource sharing, assessments, and performance tracking. Features such as MCQ and written assessments, forum communication, and feedback mechanisms enhance interaction and learning efficiency. The framework emphasizes self-learning, usability, and scalability while ensuring data storage through cloud-based systems. Additionally, it considers real-world challenges like network failure by enabling partial offline functionality. Overall, the proposed model provides a flexible, user-friendly, and scalable solution to modernize education systems and improve accessibility and learning outcomes.",

        keywords: [
            "E-learning",
            "Blended Learning",
            "Hybrid Education",
            "Online Assessment",
            "Cloud System"
        ],

        methodology: "Designed a hybrid e-learning architecture consisting of a web portal, central database, and cloud storage. Defined role-based functionalities for students, teachers, and administrators, including course management, assessments, and performance tracking. System workflows such as enrolment, MCQ and written exams, and forum interaction were modeled and analyzed using structured diagrams.",

        keyFindings: "The proposed hybrid model improves accessibility, supports self-learning, and enables efficient course management while addressing network limitations through partial offline functionality.",

        impact: "Offers a scalable and flexible education framework, particularly suitable for developing regions, enhancing digital learning accessibility and system efficiency."
    },

    {
        id: "Smart_Sewerage_IoT_2020",

        title: "Future City of Bangladesh: IoT Based Autonomous Smart Sewerage and Hazard Condition Sharing System",

        authors: "Md. Mosfikur Rahman, Mohammad Abul Kashem, Mohammad Mohiuddin, Nazmun Nessa Moon, Mohammad Alam Hossain",

        venue: "IEEE International Women in Engineering Conference on Electrical and Computer Engineering",

        year: 2020,

        doi: "10.1109/WIECON-ECE52138.2020.9397950",

        type: "conference",

        award: "🏆 IEEE Best Paper Award",

        problem: "Urban flooding and hazardous sewer environments in Dhaka lack real-time monitoring, leading to waterlogging and life-threatening conditions for workers due to toxic gas exposure.",

        solution: "Proposes an IoT-based smart sewerage system combining water level monitoring and toxic gas detection with real-time dashboard visualization and alert mechanisms.",

        challenges: "Sensor protection in harsh environments, reliable data transmission, ammonia detection accuracy, and integration with existing infrastructure posed key implementation challenges.",

        abstract: "This study presents an IoT-based autonomous smart sewerage system designed to address urban flooding and hazardous working conditions in Bangladesh. The system integrates real-time water level monitoring and toxic gas detection to predict sewer blockages and ensure worker safety. A fixed device installed in manholes uses ultrasonic sensors, force-sensitive resistors, and valves to detect rising water levels and transmit data via MQTT to a central dashboard. A portable device equipped with MQ135 sensors evaluates air quality and alerts users through LED indicators. The system divides urban areas into nodes to identify blockage locations efficiently. Experimental results using prototype implementations demonstrate the system’s ability to detect water thresholds and hazardous gas levels accurately. The solution provides early warning for waterlogging and reduces risks associated with manual sewer cleaning, offering a scalable and practical approach for smart city infrastructure.",

        keywords: [
            "IoT",
            "Smart Sewerage",
            "Flood Prediction",
            "Hazard Detection",
            "MQTT",
            "NodeMCU"
        ],

        methodology: "Developed a dual-module IoT system consisting of a fixed device for water level detection and a portable device for toxic gas sensing. Sensors (ultrasonic, FSR, MQ135) were integrated with NodeMCU and Arduino. Data were transmitted via MQTT to a central dashboard. Node-based mapping was used to identify blockage locations, and prototype experiments validated system performance.",

        keyFindings: "The system successfully detects rising water levels and hazardous gas conditions, enabling early blockage prediction and improving safety for sewer workers.",

        impact: "Provides a practical smart city solution for flood prevention and worker safety, demonstrating strong potential for real-world deployment in developing urban environments."
    },

    {
        id: "Plant_Disease_DL_2021",

        title: "Deep Learning Model for Detecting and Diagnosing Plant Disease",

        authors: "Nazmun Nessa Moon, Israt Jahan, Shayla Sharmin, Fernaz Narin Nur, Refath Ara Hossain, Md. Mosfikur Rahman",

        venue: "IEEE International Conference on Smart Generation Computing, Communication and Networking",

        year: 2021,

        doi: "10.1109/SMARTGENCON51891.2021.9645857",

        type: "conference",

        problem: "Manual plant disease detection is time-consuming and error-prone, while existing automated methods struggle with accuracy, dataset limitations, and real-world variability in agricultural environments.",

        solution: "Develops a CNN-based image classification system using preprocessing, augmentation, and transfer learning to detect and classify plant diseases from leaf images.",

        challenges: "Dataset bias, background dependency, limited real-world images, and difficulty distinguishing visually similar diseases affect model generalization.",

        abstract: "This study presents a deep learning-based approach for detecting and diagnosing plant diseases using image processing techniques. The model utilizes Convolutional Neural Networks (CNN) to classify plant leaves into healthy and diseased categories, including crops such as potato, tomato, pepper, and rice. A large dataset combining PlantVillage and additional collected images was preprocessed, labeled, and augmented to improve performance. Transfer learning using pre-trained architectures such as ResNet was applied to enhance accuracy and reduce training time. The system achieved approximately 94–95% accuracy in controlled environments. However, performance dropped significantly when tested on real-world images due to background variations and dataset bias. The study highlights the importance of data quality, preprocessing, and model optimization in agricultural AI applications. The final system demonstrates the feasibility of deploying a mobile-based disease detection tool for farmers.",

        keywords: [
            "Deep Learning",
            "CNN",
            "Plant Disease Detection",
            "Image Processing",
            "Transfer Learning",
            "Agriculture AI"
        ],

        methodology: "Collected and combined datasets including PlantVillage and rice disease images, totaling nearly 20,000 samples. Applied preprocessing techniques such as resizing, normalization, and augmentation. Used transfer learning with ResNet34 and trained CNN models in multiple phases, including image size tuning and hyperparameter optimization. Evaluated performance using accuracy and F1-score metrics.",

        keyFindings: "The model achieved up to 95% accuracy in controlled settings but dropped to around 44% in real-world conditions, highlighting dataset bias and generalization limitations.",

        impact: "Demonstrates practical use of deep learning in agriculture, with potential for mobile-based disease detection tools for farmers."
    },

    {
        id: "TraFoo_Train_Food_App_2021",

        title: "TraFoo: An Android Application for Food Delivery in Train",

        authors: "Md. Mosfikur Rahman, Nazmun Nessa Moon, Musfiqur Rahman Foysal, Fernaz Narin Nur",

        venue: "International Conference on Computing and Application Systems",

        year: 2021,

        doi: "N/A",

        type: "conference",

        problem: "Train travelers often face difficulty accessing affordable, hygienic, and timely food during journeys, with existing systems lacking coordination between customers, delivery personnel, and restaurants.",

        solution: "Develops a multi-module Android application connecting customers, riders, and restaurants to enable real-time food ordering and delivery during train journeys.",

        challenges: "Dependence on internet connectivity, real-time coordination among modules, and ensuring reliable delivery within train schedules are key challenges.",

        abstract: "This study presents TraFoo, an Android-based food delivery application designed specifically for train यात्रners. The system aims to improve food accessibility, quality, and convenience during long-distance travel. The application consists of three integrated modules: customer, rider, and restaurant. Customers can browse menus, place orders, and track deliveries, while riders receive notifications and coordinate pickups from restaurants. Restaurants manage orders and update food availability. The system is developed using Android Studio with Java and XML, and Firebase is used as the backend database for real-time data handling. The business process model ensures smooth coordination among all actors, reducing delays and improving service efficiency. Testing results demonstrate that the system is responsive, user-friendly, and capable of handling real-time operations effectively. Overall, the proposed solution enhances the travel experience by providing accessible and reliable food delivery services within train environments.",

        keywords: [
            "Android Application",
            "Food Delivery",
            "Mobile App",
            "Firebase",
            "System Design"
        ],

        methodology: "Designed a three-module system architecture including customer, rider, and restaurant applications. Implemented using Android Studio with Java and XML, and Firebase for real-time database management. Modeled workflows using business process diagrams and use-case modeling, followed by unit, functional, and system testing.",

        keyFindings: "The system enables efficient coordination between users, riders, and restaurants, improving delivery speed, usability, and overall food access during train journeys.",

        impact: "Enhances travel convenience by providing a practical mobile-based food delivery solution tailored for railway passengers."
    },

    {
        id: "Pandemic_Education_OnlineExam_2022",

        title: "Pandemic Effect on Education System among University Students",

        authors: "Farzana Yesmin, Md. Mosfikur Rahman, Mohd. Saifuzzaman, Nazmun Nessa Moon",

        venue: "Springer Lecture Notes in Networks and Systems",

        year: 2022,

        doi: "N/A",

        type: "conference",

        problem: "Online examinations during COVID-19 introduced widespread cheating and security vulnerabilities, yet lacked data-driven analysis to understand cheating behavior and improve exam integrity.",

        solution: "Applies machine learning models to analyze student behavior and predict cheating patterns, supporting development of more secure online examination systems.",

        challenges: "Limited dataset, self-reported responses, and difficulty capturing real cheating behavior reduce model reliability and generalization.",

        abstract: "This study investigates the impact of the COVID-19 pandemic on university education, focusing on online examination systems and associated security challenges. A dataset of approximately 1,000 responses was collected through Google Forms, capturing student behaviors during online exams, including external assistance and technical issues. The data were preprocessed, cleaned, and transformed into numerical form for machine learning analysis. Three algorithms—K-Nearest Neighbors (KNN), Logistic Regression, and Naïve Bayes—were applied to predict cheating patterns and performance changes. Results show that students frequently relied on external resources such as Google, friends, and online platforms during exams. Among the models, KNN achieved the highest accuracy of 95%, outperforming Logistic Regression and Naïve Bayes, which achieved around 89%. The findings highlight critical weaknesses in online examination systems and emphasize the need for improved security mechanisms, including monitoring and authentication techniques.",

        keywords: [
            "Online Education",
            "Online Exam Security",
            "Machine Learning",
            "KNN",
            "Cheating Detection",
            "COVID-19"
        ],

        methodology: "Collected ~1,000 responses via Google Forms capturing student exam behavior. Converted data into numerical format through preprocessing and cleaning. Applied supervised learning models (KNN, Logistic Regression, Naïve Bayes) with train-test split, and evaluated performance using accuracy, precision, recall, and confusion matrix .",

        keyFindings: "KNN achieved highest accuracy (95%), revealing strong patterns in cheating behavior. Students heavily relied on external resources, exposing major weaknesses in online exam systems.",

        impact: "Supports development of secure online exam systems by identifying cheating patterns and guiding future improvements in digital education assessment."
    },

    {
        id: "CyberSecurity_IDS_DL_2022",

        title: "Cyber Security Intruder Detection using Deep Learning Approach",

        authors: "Tariqul Islam, Md. Mosfikur Rahman, Mohd. Saifuzzaman, Md. Ismail Jabiullah",

        venue: "Springer Lecture Notes in Networks and Systems",

        year: 2022,

        doi: "N/A",

        type: "conference",

        problem: "Traditional intrusion detection systems rely on signature-based methods, which fail to detect new or evolving cyber-attacks and require frequent updates, limiting effectiveness in modern dynamic network environments.",

        solution: "Proposes a deep learning-based intrusion detection system using neural networks to classify network traffic and detect multiple cyber-attacks from large-scale datasets.",

        challenges: "Highly imbalanced dataset, overlapping attack patterns, and high-dimensional network features make accurate classification and generalization difficult.",

        abstract: "This study presents a deep learning-based intrusion detection system for identifying cyber-attacks in network traffic. The model utilizes the CICIDS2017 dataset, containing over 2.5 million records and multiple attack types including DDoS, DoS, and PortScan. Data preprocessing involved cleaning, normalization, feature selection, and encoding to prepare high-dimensional network features for model training. A feedforward neural network with backpropagation was implemented using TensorFlow, incorporating techniques such as dropout and early stopping to improve generalization. Visualization techniques including PCA and t-SNE revealed overlapping feature distributions, indicating classification complexity. The model achieved approximately 91.2% accuracy in multiclass classification, while binary classification tasks reached up to 99% accuracy across multiple algorithms. The findings demonstrate the effectiveness of deep learning in detecting both known and unknown cyber threats, providing a scalable approach for modern intrusion detection systems.",

        keywords: [
            "Cyber Security",
            "Intrusion Detection System",
            "Deep Learning",
            "Neural Network",
            "CICIDS2017",
            "Network Security"
        ],

        methodology: "Used CICIDS2017 dataset (~2.5M records, 79 features). Performed preprocessing including cleaning, normalization, feature encoding, and dimensionality reduction (PCA, t-SNE). Built a feedforward neural network using TensorFlow with dropout and early stopping. Evaluated using multiclass and binary classification with metrics like accuracy, precision, recall, and confusion matrix .",

        keyFindings: "Achieved ~91.2% accuracy in multiclass classification and up to 99% in binary tasks. Deep learning models effectively detect both known and unknown cyber-attacks.",

        impact: "Provides a scalable AI-based intrusion detection solution, improving cyber security by enabling detection of evolving and unknown attack patterns."
    },

    {
        id: "Chaotic_Encryption_CRSA_2023",

        title: "A New Chaotic-Based Analysis of Data Encryption and Decryption",

        authors: "Fatema Tuj Johora, Alamin-Ul-Islam, Farzana Yesmin, Md. Mosfikur Rahman",

        venue: "Advances in Data Science and Artificial Intelligence, Springer",

        year: 2023,

        doi: "10.1007/978-3-031-16178-0_32",

        type: "conference",

        problem: "Traditional encryption techniques face challenges in generating highly unpredictable keys and ensuring strong resistance against modern cyber-attacks and data breaches.",

        solution: "Proposes a chaotic random seed-based encryption algorithm (CRSA) that dynamically generates secure keys using time-dependent randomness and value transformation.",

        challenges: "Balancing randomness with computational efficiency, ensuring scalability, and achieving performance comparable to standard algorithms like AES remain key challenges.",

        abstract: "This study presents a chaotic-based encryption and decryption approach designed to enhance data security through dynamic key generation. The proposed CRSA (Chaotic Random Seed Algorithm) leverages time-dependent random seeds to generate unpredictable encryption keys, improving resistance against brute-force and pattern-based attacks. The method applies ASCII-based transformations combined with generated random values to encrypt plaintext iteratively. The system architecture includes defined workflows for both encryption and decryption processes, supported by algorithmic modeling and implementation. Experimental evaluations compare the proposed method with established algorithms such as AES and DES in terms of encryption time, memory utilization, and throughput. Results indicate that while CRSA may require slightly more computational time than AES, it offers improved randomness and competitive security performance. The model also demonstrates flexibility across multiple data types, including text, images, and audio, highlighting its applicability in secure communication systems.",

        keywords: [
            "Cryptography",
            "Chaotic Algorithm",
            "Encryption",
            "Random Seed",
            "Data Security",
            "CRSA"
        ],

        methodology: "Designed a chaotic encryption algorithm using millisecond-based random seed generation. Applied ASCII value transformation combined with dynamically generated random numbers for iterative encryption and decryption. Developed system workflows and evaluated performance through comparative analysis with AES and DES based on execution time, memory usage, and throughput.",

        keyFindings: "CRSA enhances key randomness and security, achieving competitive performance with AES while outperforming traditional methods like DES in efficiency and unpredictability.",

        impact: "Provides a secure and flexible encryption approach suitable for modern communication systems and future cloud-based security applications."
    },

    {
        id: "COVID19_ML_Prediction_2022",

        title: "Machine Learning-Based Prediction of COVID-19: A Robust Approach for Early Diagnosis and Treatment",

        authors: "Fatema Tuj Johora, Israt Binte Mahfuja, A N M Masuqur Rahman, Md. Mosfikur Rahman, Md. Sadekur Rahman",

        venue: "Springer Lecture Notes in Networks and Systems",

        year: 2022,

        doi: "N/A",

        type: "conference",

        problem: "Early diagnosis of COVID-19 is challenging due to limited testing capacity and delayed detection, especially in densely populated regions, requiring scalable predictive systems for timely intervention.",

        solution: "Applies multiple supervised machine learning algorithms to predict COVID-19 infection and severity based on clinical and demographic data for early diagnosis.",

        challenges: "Data inconsistency, limited clinical dataset size, and variability in symptoms affect model reliability and generalization across populations.",

        abstract: "This study presents a machine learning-based approach for early prediction and diagnosis of COVID-19 using clinical and demographic data. A dataset of 3,039 records with 23 features was collected from medical institutions and online sources, then preprocessed through normalization, missing value handling, and feature encoding. Multiple supervised learning algorithms including KNN, Decision Tree, Random Forest, AdaBoost, XGBoost, Logistic Regression, SVM, and Naïve Bayes were applied and evaluated using accuracy, Jaccard score, and cross-validation. Among these, XGBoost achieved the highest accuracy of approximately 98.19%, followed by Random Forest and Decision Tree. The proposed system enables early prediction of COVID-19 infection and supports healthcare decision-making. The model can be integrated into digital platforms to assist in remote diagnosis, reducing pressure on healthcare systems and improving early intervention strategies.",

        keywords: [
            "COVID-19",
            "Machine Learning",
            "Prediction Model",
            "XGBoost",
            "Healthcare AI",
            "Early Diagnosis"
        ],

        methodology: "Collected dataset (3,039 samples, 23 features) from medical institutions and online sources. Performed preprocessing including normalization, missing value imputation, and encoding. Applied multiple ML algorithms (KNN, Decision Tree, Random Forest, XGBoost, SVM, etc.) and evaluated using accuracy, Jaccard score, cross-validation, and confusion matrix. Selected best model based on performance metrics .",

        keyFindings: "XGBoost achieved highest accuracy (~98.19%), outperforming other models, demonstrating strong capability for early COVID-19 prediction using clinical data.",

        impact: "Supports early diagnosis and remote healthcare decision-making, reducing system burden and improving pandemic response efficiency."
    }
];

const PaperDetailCard = ({ paper, index }: { paper: PaperDetail; index: number }) => (
    <motion.article
        className="border border-border rounded-xl p-6 md:p-7 bg-background hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
    >
        {/* Header */}
        <div className="mb-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {paper.type === "journal" ? "Journal Article" : "Conference Paper"} · {paper.year}
            </p>

            <h3 className="text-lg md:text-xl font-semibold text-foreground mt-1 leading-snug">
                {paper.title}
            </h3>

            <p className="text-xs text-muted-foreground mt-2">{paper.authors}</p>
            <p className="text-xs italic text-muted-foreground">{paper.venue}</p>
        </div>

        {/* Abstract */}
        <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Abstract
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
                {paper.abstract}
            </p>
        </div>

        {/* Problem + Challenges */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Problem
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.problem}
                </p>
            </div>

            <div>
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Challenges
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.challenges}
                </p>
            </div>
        </div>

        {/* Solution (highlighted but subtle) */}
        <div className="mb-4 border-l-2 border-accent pl-4">
            <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Proposed Solution
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium">
                {paper.solution}
            </p>
        </div>

        {/* Method + Results */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Methodology
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.methodology}
                </p>
            </div>

            <div>
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Key Findings
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.keyFindings}
                </p>
            </div>
        </div>

        {/* Impact */}
        <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Impact
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
                {paper.impact}
            </p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-4">
            {paper.keywords.map((kw) => (
                <span
                    key={kw}
                    className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground"
                >
          {kw}
        </span>
            ))}
        </div>

        {/* DOI */}
        <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
            <ExternalLink className="w-3 h-3" />
            View Publication
        </a>
    </motion.article>
);

const PapersDetailSection = () => {
    const journals = papers.filter((p) => p.type === "journal");
    const conferences = papers.filter((p) => p.type === "conference");

    return (
        <section id="research" className="section-padding bg-section-alt">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                >
                    <p className="section-label">Research Papers</p>
                    <h2 className="section-title">Research Contributions</h2>
                    <p className="section-desc">
                        Each paper presented with abstract, methodology, key findings, and real-world impact drawn
                        directly from the published manuscripts.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                            Journal Articles ({journals.length})
                        </h3>
                        <div className="space-y-6">
                            {journals.map((paper, i) => (
                                <PaperDetailCard key={paper.id} paper={paper} index={i}/>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                            Conference Papers ({conferences.length})
                        </h3>
                        <div className="space-y-6">
                            {conferences.map((paper, i) => (
                                <PaperDetailCard key={paper.id} paper={paper} index={i}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PapersDetailSection;
