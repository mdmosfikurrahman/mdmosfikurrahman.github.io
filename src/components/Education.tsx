import {Award, Calendar, Globe, Star} from 'lucide-react';
import {Card, CardHeader, CardTitle} from '@/components/ui/card';

const Education = () => {
    const educationData = [
        {
            institution: "Daffodil International University",
            degree: "Bachelor of Science in Computer Science and Engineering",
            duration: "January 2018 – December 2021",
            grade: "CGPA: 3.83/4.00",
            icon: <Award className="w-6 h-6 text-blue-600"/>
        },
        {
            institution: "Adam Mickiewicz University, Poznań, Poland",
            degree: "Erasmus+ Exchange Program in Computer Science",
            duration: "March 2021 – August 2021",
            grade: "Completed 6 ECTS under the European Credit Transfer System",
            icon: <Globe className="w-6 h-6 text-green-600"/>
        },
        {
            institution: "Major General Mahmudul Hasan Adarsha College",
            degree: "Higher Secondary School Certificate (HSC)",
            duration: "2016",
            grade: "GPA: 4.67/5.00",
            icon: <Star className="w-6 h-6 text-yellow-600"/>
        },
        {
            institution: "Police Lines Adarsha High School",
            degree: "Secondary School Certificate (SSC)",
            duration: "2014",
            grade: "GPA: 5.00/5.00",
            icon: <Award className="w-6 h-6 text-red-600"/>
        }
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
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            {edu.icon}
                                        </div>
                                        <div>
                                            <CardTitle
                                                className="text-xl text-gray-900 mb-2">{edu.institution}</CardTitle>
                                            <p className="text-lg text-primary font-semibold mb-2">{edu.degree}</p>
                                            <p className="text-gray-700">{edu.grade}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4"/>
                                        <span>{edu.duration}</span>
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
