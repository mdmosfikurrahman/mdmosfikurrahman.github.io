'use client';

import { useEffect } from 'react';
import { techIconMap } from '@/components/TechIcons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Activities = () => {
  const activities = [
    {
      title: "Conference Speaker",
      description:
          "10th IEEE International Women in Engineering (WIE) Conference on Electrical and Computer Engineering 2024 (IEEE WIECON-ECE 2024)",
      iconKey: "Speaker",
      color: "bg-blue-100",
    },
    {
      title: "Guest Speaker",
      description:
          "\"How to Get Started: Undergraduate Research Journey\" organized by the Computer & Programming Club, Daffodil International University",
      iconKey: "Speaker",
      color: "bg-green-100",
    },
    {
      title: "Vice President",
      description:
          "Research & Career Wing (2021), Computer & Programming Club, Daffodil International University",
      iconKey: "Leadership",
      color: "bg-purple-100",
    },
    {
      title: "Technical Lead",
      description:
          "\"Take Off – 2020\", university-wide tech event organized by the Computer & Programming Club, Daffodil International University",
      iconKey: "Leadership",
      color: "bg-orange-100",
    },
    {
      title: "Organizing Member",
      description:
          "Programming Contest at \"Take Off – 2019\", Computer & Programming Club, Daffodil International University",
      iconKey: "Community",
      color: "bg-red-100",
    },
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

  const badgeIds = [
    "daf46bed-e3e1-42d6-9fb4-8d0ab2fd825b",
    "b8f09d7b-27db-4f31-b738-b27b84a7ebf3",
    "7c97e2b4-b2ec-4413-a39d-31a0f2d3a869"
  ];

  useEffect(() => {
    const scriptId = "credly-embed-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "//cdn.credly.com/assets/utilities/embed.js";
      script.async = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

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
                    {techIconMap["Activity"]}
                  </div>
                  Extracurricular Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                          {techIconMap[activity.iconKey]}
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
                    {techIconMap["Activity"]}
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

                {/* Credly Badges */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Professional Badges</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badgeIds.map((badgeId, index) => (
                        <div
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: `<div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="${badgeId}" data-share-badge-host="https://www.credly.com"></div>`
                            }}
                        />
                    ))}
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
