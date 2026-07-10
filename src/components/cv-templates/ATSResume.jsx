import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  role: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 8,
    color: '#4b5563',
    marginHorizontal: 5,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9,
    color: '#1f2937',
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 8,
  },
  rowJustify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  companyRole: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#111111',
  },
  date: {
    fontSize: 8,
    color: '#4b5563',
  },
  descriptionText: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'justify',
  },
  techText: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  educationItem: {
    marginBottom: 4,
  },
  eduTitle: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  eduInst: {
    color: '#4b5563',
  },
  skillsText: {
    fontSize: 9,
    color: '#1f2937',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  bulletList: {
    paddingLeft: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  bulletSign: {
    width: 6,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#1f2937',
  }
});

export function ATSResume({ data }) {
  if (!data) return null;
  const { info, experiences = [], qualifications = [] } = data;

  const educations = qualifications.filter(q => q.type === 'education');
  const honors = qualifications.filter(q => q.type === 'honor');
  const certs = qualifications.filter(q => q.type === 'certification');

  const skillsList = Array.isArray(info?.skills)
    ? info.skills
    : JSON.parse(info?.skills || '[]');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{info?.full_name || 'Haikal Jibran Al Ghiffarry'}</Text>
          <Text style={styles.role}>{info?.role || 'Systems Architect & Full-stack Developer'}</Text>
          <View style={styles.contactContainer}>
            <Text style={styles.contactItem}>{info?.email || 'hello@ghiffa.dev'}</Text>
            {info?.phone_number && <Text style={styles.contactItem}>•  {info.phone_number}</Text>}
            {info?.social_links?.linkedin && (
              <Text style={styles.contactItem}>
                •  LinkedIn: {info.social_links.linkedin.replace('https://', '')}
              </Text>
            )}
            {info?.social_links?.github && (
              <Text style={styles.contactItem}>
                •  GitHub: {info.social_links.github.replace('https://', '')}
              </Text>
            )}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>{info?.about_content || ''}</Text>
        </View>

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experiences.map((exp, idx) => (
              <View key={exp.id || idx} style={styles.experienceItem}>
                <View style={styles.rowJustify}>
                  <Text style={styles.companyRole}>
                    {exp.role.toUpperCase()} — {exp.company.toUpperCase()}
                  </Text>
                  <Text style={styles.date}>{exp.period}</Text>
                </View>
                <Text style={styles.descriptionText}>{exp.description}</Text>
                {exp.tech_stack && (
                  <Text style={styles.techText}>
                    Technologies: {Array.isArray(exp.tech_stack) ? exp.tech_stack.join(', ') : JSON.parse(exp.tech_stack || '[]').join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu, idx) => (
              <View key={edu.id || idx} style={styles.educationItem}>
                <View style={styles.rowJustify}>
                  <Text style={styles.eduTitle}>
                    {edu.title} <Text style={styles.eduInst}>- {edu.institution}</Text>
                  </Text>
                  <Text style={styles.date}>{edu.period}</Text>
                </View>
                {edu.description && <Text style={styles.descriptionText}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Skills</Text>
            <Text style={styles.skillsText}>{skillsList.join('  •  ')}</Text>
          </View>
        )}

        {/* Honors and Certifications */}
        <View style={styles.columnsContainer}>
          {/* Certifications */}
          <View style={styles.column}>
            {certs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={styles.bulletList}>
                  {certs.map((cert, idx) => (
                    <View key={cert.id || idx} style={styles.bulletItem}>
                      <Text style={styles.bulletSign}>•</Text>
                      <Text style={styles.bulletText}>
                        {cert.title} ({cert.institution} — {cert.period})
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Honors */}
          <View style={styles.column}>
            {honors.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Honors & Awards</Text>
                <View style={styles.bulletList}>
                  {honors.map((honor, idx) => (
                    <View key={honor.id || idx} style={styles.bulletItem}>
                      <Text style={styles.bulletSign}>•</Text>
                      <Text style={styles.bulletText}>
                        {honor.title} ({honor.institution} — {honor.period})
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
