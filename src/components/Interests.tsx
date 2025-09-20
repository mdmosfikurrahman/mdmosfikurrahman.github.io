
import { Heart, BookOpen, Coffee, Users, Code, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Interests = () => {
  const researchInterests = [
    { name: "Data Science", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Machine Learning", icon: <Lightbulb className="w-5 h-5" /> },
    { name: "Artificial Intelligence", icon: <Code className="w-5 h-5" /> },
    { name: "Internet of Things (IoT)", icon: <Users className="w-5 h-5" /> },
    { name: "Software Development Methodologies", icon: <Code className="w-5 h-5" /> }
  ];

  const personalInterests = [
    {
      title: "Mentoring & Public Speaking",
      description: "Passionate about sharing knowledge in backend architecture, academic research, and career development for early-stage professionals.",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      title: "Academic Collaboration",
      description: "Regularly participate in conferences and workshops to collaborate with tech and academic communities.",
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      color: "bg-green-100"
    },
    {
      title: "Wellness & Mindfulness",
      description: "Enjoy walking and light jogging as part of a mindful lifestyle to maintain work-life balance.",
      icon: <Heart className="w-8 h-8 text-red-600" />,
      color: "bg-red-100"
    },
    {
      title: "Continuous Learning",
      description: "Passionate about reading research papers and exploring advancements in AI and system design.",
      icon: <Lightbulb className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-100"
    }
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
                Beyond my role as a Software Engineer, I am deeply invested in <span className="font-semibold text-primary">mentoring and public speaking</span>,
                particularly in areas related to backend architecture, academic research, and career development for
                early-stage professionals. I regularly participate in conferences and workshops to share knowledge and
                collaborate with the tech and academic communities.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                My core research interests lie at the intersection of <span className="font-semibold text-primary">technology and real-world problem solving</span>,
                focusing on creating innovative solutions that bridge academic research with practical industry applications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Research Interests */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Research Interests</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {researchInterests.map((interest, index) => (
              <div
                key={index}
                className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-3 border border-gray-100"
              >
                <div className="text-primary">{interest.icon}</div>
                <span className="font-medium text-gray-900">{interest.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Interests */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Personal Interests & Activities</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {personalInterests.map((interest, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${interest.color} group-hover:scale-110 transition-transform duration-300`}>
                      {interest.icon}
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-primary transition-colors">
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

        {/*/!* Call to Action *!/*/}
        {/*<div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>*/}
        {/*  <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">*/}
        {/*    <CardContent className="p-8">*/}
        {/*      <h3 className="text-2xl font-bold text-gray-900 mb-4">Let's Connect & Collaborate</h3>*/}
        {/*      <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">*/}
        {/*        I'm always interested in discussing new opportunities, research collaborations, or simply sharing insights*/}
        {/*        about backend development and academic research. Whether you're looking for a skilled software engineer*/}
        {/*        or a research collaborator, I'd love to hear from you.*/}
        {/*      </p>*/}
        {/*      <div className="flex flex-wrap justify-center gap-4">*/}
        {/*        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">*/}
        {/*          Full-Stack Engineering Opportunities*/}
        {/*        </span>*/}
        {/*        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">*/}
        {/*          PhD & Masters Programs*/}
        {/*        </span>*/}
        {/*        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">*/}
        {/*          Research Collaborations*/}
        {/*        </span>*/}
        {/*      </div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}
      </div>
    </section>
  );
};

export default Interests;
