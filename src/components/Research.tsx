
import { Book, Mic, User, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Research = () => {
  const journals = [
    {
      title: "Impactful e-learning framework: A new hybrid form of education",
      journal: "Current Research in Behavioral Sciences",
      year: "2021",
      doi: "https://doi.org/10.1016/j.crbeha.2021.100038"
    },
    {
      title: "Impact of COVID-19 on mental health",
      journal: "Current Research in Behavioral Sciences",
      year: "2021",
      doi: "https://doi.org/10.1016/j.crbeha.2021.100037"
    },
    {
      title: "COVID-19 and Bangladesh: Situation report",
      journal: "Current Research in Behavioral Sciences",
      year: "2021",
      doi: "https://doi.org/10.1016/j.crbeha.2021.100034"
    }
  ];

  const conferences = [
    {
      title: "Future City of Bangladesh: IoT-Based Smart Sewerage",
      conference: "IEEE WIECON-ECE",
      year: "2020",
      doi: "https://doi.org/10.1109/WIECON-ECE52138.2020.9397950"
    },
    {
      title: "Deep Learning Model for Plant Disease Detection",
      conference: "SMART GENCON",
      year: "2021",
      doi: "https://doi.org/10.1109/SMARTGENCON51891.2021.9645857"
    },
    {
      title: "TraFoo: Android App for Food Delivery in Train",
      conference: "SMART GENCON",
      year: "2021",
      doi: "https://doi.org/10.1109/SMARTGENCON51891.2021.9645900"
    },
    {
      title: "Pandemic Effect on Education System",
      conference: "Springer: Progress in AI & Robotics",
      year: "2022",
      doi: "https://doi.org/10.1007/978-3-030-98531-8_16"
    },
    {
      title: "ML-Based Prediction of COVID-19",
      conference: "Springer: Trends in Computational and Cognitive Engineering",
      year: "2024",
      doi: "https://doi.org/10.1007/978-981-97-1923-5_16"
    }
  ];

  const reviewerRoles = [
    "Current Research in Behavioral Sciences",
    "ISA Transactions",
    "Natural Language Processing Journal",
    "Journal of King Saud University – Computer & Information Sciences",
    "International Conference on Deep Learning, Artificial Intelligence & Robotics (2022)",
    "International Conference on Information Systems & Management Science (2022)",
    "International Conference on Communication & Information Systems (2022)"
  ];

  return (
    <section id="research" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Research & Publications</h2>
          <p className="text-lg text-gray-600">Academic contributions and scholarly work</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Journals */}
          <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Book className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Journal Publications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journals.map((paper, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900 mb-1">{paper.title}</h4>
                    <p className="text-sm text-blue-600 mb-1">{paper.journal}, {paper.year}</p>
                    <Button asChild variant="link" size="sm" className="p-0 h-auto">
                      <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        DOI
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conferences */}
          <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Mic className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Conference Papers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conferences.map((paper, index) => (
                  <div key={index} className="border-l-4 border-green-600 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">{paper.title}</h4>
                    <p className="text-sm text-green-600 mb-1">{paper.conference}, {paper.year}</p>
                    <Button asChild variant="link" size="sm" className="p-0 h-auto">
                      <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        DOI
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviewer Roles */}
          <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Research Contributions & Reviewer Roles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {reviewerRoles.map((role, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-sm text-gray-900">Reviewer</span>
                      <p className="text-sm text-gray-700">{role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Research Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-primary">10+</div>
            <div className="text-sm text-gray-600">Total Publications</div>
          </div>
          <div className="text-center animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="text-sm text-gray-600">Journal Papers</div>
          </div>
          <div className="text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl font-bold text-primary">7</div>
            <div className="text-sm text-gray-600">Conference Papers</div>
          </div>
          <div className="text-center animate-fade-up" style={{ animationDelay: '0.45s' }}>
            <div className="text-3xl font-bold text-primary">7</div>
            <div className="text-sm text-gray-600">Reviewer Roles</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Research;
