
import React from 'react';
import { UserAssessment } from '../types';
import { GeometricBadge } from './Badges';

interface CVTemplateProps {
  profile: UserAssessment;
  badges: string[];
}

const CVTemplate: React.FC<CVTemplateProps> = ({ profile, badges = [] }) => {
  return (
    <div id="cv-template" className="w-[210mm] min-h-[297mm] bg-white p-[20mm] text-gray-900 font-sans shadow-2xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="border-b-4 border-brand-dark pb-8 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">{profile.fullName}</h1>
          <p className="text-xl text-brand-light font-medium">{profile.currentRole || 'مستخدم مسار'}</p>
        </div>
        <div className="text-left text-sm text-gray-500">
          <p>{profile.email}</p>
          <p>{profile.experienceLevel === 'junior' ? 'مستوى مبتدئ' : profile.experienceLevel === 'mid' ? 'مستوى متوسط' : 'مستوى خبير'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12">
        {/* Main Column */}
        <div className="col-span-2 space-y-10">
          {/* Summary */}
          <section>
            <h2 className="text-lg font-bold text-brand-dark mb-4 border-r-4 border-brand-light pr-3 text-right">الملخص المهني</h2>
            <p className="text-gray-600 leading-relaxed text-sm text-right">{profile.summary}</p>
          </section>

          {/* Projects */}
          {(profile.projects || []).length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4 border-r-4 border-brand-light pr-3 text-right">المشاريع البارزة</h2>
              <div className="space-y-4">
                {profile.projects.map(project => (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-xl text-right">
                    <h3 className="font-bold text-brand-dark mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          <section>
            <h2 className="text-lg font-bold text-brand-dark mb-4 border-r-4 border-brand-light pr-3 text-right">التعليم</h2>
            <div className="p-4 border border-gray-100 rounded-xl text-right">
              <p className="font-bold text-gray-800">{profile.education || 'لم يتم تحديد التعليم بعد'}</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-10">
          {/* Skills */}
          <section>
            <h2 className="text-lg font-bold text-brand-dark mb-4 border-r-4 border-brand-light pr-3 text-right">المهارات</h2>
            <div className="space-y-3">
              {(profile.skills || []).map(skill => (
                <div key={skill} className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">{skill}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full">
                    <div className="bg-brand-light h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-lg font-bold text-brand-dark mb-4 border-r-4 border-brand-light pr-3 text-right">الأوسمة الرقمية</h2>
            <div className="flex flex-wrap gap-4 justify-end">
              {(badges || []).map(badge => (
                <div key={badge} className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <GeometricBadge type={badge} size={32} />
                </div>
              ))}
            </div>
          </section>

          {/* Courses */}
          {(profile.courses || []).length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4 border-r-4 border-brand-light pr-3 text-right">الدورات التدريبية</h2>
              <div className="space-y-4">
                {profile.courses.map(course => (
                  <div key={course.id} className="text-sm text-right bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <p className="font-bold text-gray-800">{course.name}</p>
                    <p className="text-[10px] text-brand-light font-black uppercase tracking-widest mt-1">{course.provider}</p>
                    <div className="flex flex-col mt-2 text-[9px] text-gray-500 font-bold gap-1">
                      <span>{course.date}</span>
                      {course.duration && <span>مدة الدورة: {course.duration}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-20 pt-8 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">تم إنشاء هذه السيرة الذاتية عبر منصة مسار للتحليل المهني</p>
      </div>
    </div>
  );
};

export default CVTemplate;
