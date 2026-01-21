import { techIconMap } from '@/components/TechIcons';
import {Card, CardHeader, CardTitle} from '@/components/ui/card';

const Education = () => {
    const educationData = [
        {
            institution: "Daffodil International University",
            degree: "Bachelor of Science in Computer Science and Engineering",
            duration: "January 2018 – December 2021",
            grade: "CGPA: 3.83/4.00",
            iconKey: "Degree",
            description: [
                "Completed a rigorous undergraduate curriculum covering core areas of computer science and software engineering",
                "Built a strong foundation in programming, data structures, algorithms, and software design principles",
                "Actively engaged in academic research activities and collaborative technical projects",
                "Graduated with strong academic standing through consistent performance across coursework",
            ],
        },
        {
            institution: "Adam Mickiewicz University, Poznań, Poland",
            degree: "Erasmus+ Exchange Program in Computer Science",
            duration: "March 2021 – August 2021",
            grade: "Completed 6 ECTS under the European Credit Transfer System",
            iconKey: "International",
            description: [
                "Completed Artificial Intelligence–focused coursework combining both theoretical foundations and hands-on laboratory work",
                "Studied core AI concepts including learning models, algorithmic reasoning, and data-driven problem solving",
                "Applied theoretical knowledge through lab assignments emphasizing implementation and experimentation",
                "Gained exposure to research-oriented teaching methods within a European academic environment",
                "Worked with AI-related lab assignments involving model implementation and experimental evaluation",
            ],
        },
        {
            institution: "Major General Mahmudul Hasan Adarsha College",
            degree: "Higher Secondary School Certificate (HSC)",
            duration: "2016",
            grade: "GPA: 4.67/5.00",
            iconKey: "Achievement",
            description: [
                "Completed higher secondary education with concentration in science disciplines",
                "Developed early analytical and problem-solving skills through mathematics and science coursework",
                "Maintained strong academic performance across core subjects",
            ],
        },
        {
            institution: "Police Lines Adarsha High School",
            degree: "Secondary School Certificate (SSC)",
            duration: "2014",
            grade: "GPA: 5.00/5.00",
            iconKey: "Achievement",
            description: [
                "Completed secondary education with a strong academic foundation",
                "Demonstrated consistent academic excellence across all core subjects",
                "Developed disciplined study habits and long-term academic focus",
            ],
        },
    ];

    return (
        <section id="education" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Education</h2>
                    <p className="text-lg text-gray-600">Academic journey and achievements</p>
                </div>

                <div className="space-y-6">
                    {educationData.map((edu, index) => (
                        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="relative">

                                {/* Duration (top-right, floating) */}
                                <div className="absolute top-6 right-6 flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                                    {techIconMap["Calendar"]}
                                    <span>{edu.duration}</span>
                                </div>

                                {/* Main content (full width) */}
                                <div className="flex items-start gap-4">

                                    <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                                        {techIconMap[edu.iconKey]}
                                    </div>

                                    <div className="w-full">
                                        <CardTitle className="text-xl text-gray-900 mb-1">
                                            {edu.institution}
                                        </CardTitle>

                                        <p className="text-lg text-primary font-semibold">
                                            {edu.degree}
                                        </p>

                                        <p className="text-gray-700 mt-1">{edu.grade}</p>

                                        {edu.description && (
                                            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
                                                {edu.description.map((point) => (
                                                    <li key={point}>{point}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
