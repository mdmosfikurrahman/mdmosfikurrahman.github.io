
import { Star, Users, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Activities = () => {
  const activities = [
    {
      title: "Conference Speaker",
      description: "10th IEEE International Women in Engineering (WIE) Conference on Electrical and Computer Engineering 2024 (IEEE WIECON-ECE 2024)",
      icon: <Mic className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      title: "Guest Speaker",
      description: "\"How to Get Started: Undergraduate Research Journey\" organized by the Computer & Programming Club, Daffodil International University",
      icon: <Mic className="w-6 h-6 text-green-600" />,
      color: "bg-green-100"
    },
    {
      title: "Vice President",
      description: "Research & Career Wing (2021), Computer & Programming Club, Daffodil International University",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-100"
    },
    {
      title: "Technical Lead",
      description: "\"Take Off – 2020\", university-wide tech event organized by the Computer & Programming Club, Daffodil International University",
      icon: <Star className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-100"
    },
    {
      title: "Organizing Member",
      description: "Programming Contest at \"Take Off – 2019\", Computer & Programming Club, Daffodil International University",
      icon: <Users className="w-6 h-6 text-red-600" />,
      color: "bg-red-100"
    }
  ];

  const certifications = [
    {
      title: "IBM Data Science Professional Certificate",
      provider: "Coursera",
      description: "Professional Certificate in Data Science"
    },
    {
      title: "Data Science for Everyone",
      provider: "DataCamp",
      description: "Basic to Advanced Data Science Tutorial Certification"
    },
    {
      title: "Machine Learning for Everyone",
      provider: "DataCamp",
      description: "Machine Learning Certification from Basic to Advanced"
    }
  ];

  return (
    <section id="activities" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Activities & Certifications</h2>
          <p className="text-lg text-gray-600">Leadership roles and professional development</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Activities */}
          <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                Extracurricular Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                Professional Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-3">
                    <h4 className="font-semibold text-gray-900 mb-1">{cert.title}</h4>
                    <p className="text-sm text-primary font-medium mb-1">{cert.provider}</p>
                    <p className="text-sm text-gray-700">{cert.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Badges Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Professional Badges</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Star className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-xs font-medium">IBM Data Science</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Star className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-xs font-medium">DataCamp ML</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Star className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-xs font-medium">DataCamp DS</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Activities;
