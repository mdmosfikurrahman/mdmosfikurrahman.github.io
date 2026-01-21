import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {techIconMap} from '@/components/TechIcons';

const Interests = () => {
    const researchInterests = [
        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",
        "IoT",
        "Software Development Methodologies",
    ];

    const personalInterests = [
        {
            title: "Mentoring & Public Speaking",
            description:
                "Passionate about sharing knowledge in backend architecture, academic research, and career development for early-stage professionals.",
            iconKey: "Mentoring",
            color: "bg-blue-100",
        },
        {
            title: "Academic Collaboration",
            description:
                "Participate in conferences, workshops, and research discussions to collaborate with academic and technical communities.",
            iconKey: "Academic Collaboration",
            color: "bg-green-100",
        },
        {
            title: "Wellness & Mindfulness",
            description:
                "Enjoy walking and light jogging as part of a mindful lifestyle to maintain work-life balance.",
            iconKey: "Wellness",
            color: "bg-red-100",
        },
        {
            title: "Continuous Learning",
            description:
                "Regularly read research papers and explore advancements in AI and system design.",
            iconKey: "Learning",
            color: "bg-purple-100",
        },
    ];

    return (
        <section id="interests" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Interests & Passions</h2>
                    <p className="text-lg text-gray-600">What drives my professional and personal growth</p>
                </div>

                <div className="mb-12 animate-fade-up">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-8">
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Beyond my role as a Software Engineer, I am deeply invested in <span
                                className="font-semibold text-primary">mentoring and public speaking</span>,
                                particularly in areas related to backend architecture, academic research, and career
                                development for
                                early-stage professionals. I regularly participate in conferences and workshops to share
                                knowledge and
                                collaborate with the tech and academic communities.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                My core research interests lie at the intersection of <span
                                className="font-semibold text-primary">technology and real-world problem solving</span>,
                                focusing on creating innovative solutions that bridge academic research with practical
                                industry applications.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Research Interests */}
                <div className="mb-12 animate-fade-up" style={{animationDelay: '0.1s'}}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Research Interests</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {researchInterests.map((interest) => (
                            <div
                                key={interest}
                                className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-3 border border-gray-100"
                            >
                                <div className="text-primary">
                                    {techIconMap[interest]}
                                </div>
                                <span className="font-medium text-gray-900">{interest}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Personal Interests */}
                <div className="animate-fade-up" style={{animationDelay: '0.2s'}}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Personal Interests &
                        Activities</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {personalInterests.map((interest, index) => (
                            <Card key={index}
                                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-lg ${interest.color} group-hover:scale-110 transition-transform duration-300`}>
                                            {techIconMap[interest.iconKey]}
                                        </div>
                                        <CardTitle
                                            className="text-lg text-gray-900 group-hover:text-primary transition-colors">
                                            {interest.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">{interest.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Interests;