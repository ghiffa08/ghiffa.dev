import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#111111',
    backgroundColor: '#fafafa',
    borderWidth: 8,
    borderColor: '#111111',
    borderStyle: 'solid',
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 4,
    borderBottomColor: '#111111',
    paddingBottom: 12,
    marginBottom: 16,
  },
  bannerLeft: {
    width: '65%',
  },
  bannerRight: {
    width: '35%',
    textAlign: 'right',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    marginBottom: 2,
    color: '#111111',
  },
  role: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  contactText: {
    fontSize: 8,
    color: '#374151',
    fontFamily: 'Courier',
    marginBottom: 2,
    textAlign: 'right',
  },
  mainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftCol: {
    width: '63%',
  },
  rightCol: {
    width: '32%',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e5e5',
    paddingLeft: 12,
  },
  sectionHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9ca3af',
    fontFamily: 'Courier',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileText: {
    fontSize: 9.5,
    color: '#374151',
    textAlign: 'justify',
    marginBottom: 16,
    paddingRight: 8,
  },
  experienceItem: {
    borderLeftWidth: 2,
    borderLeftColor: '#111111',
    paddingLeft: 10,
    marginBottom: 14,
  },
  rowJustify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111111',
  },
  expDate: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    fontFamily: 'Courier',
  },
  expCompany: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#9ca3af',
    fontFamily: 'Courier',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  expDesc: {
    fontSize: 9,
    color: '#4b5563',
    textAlign: 'justify',
    paddingRight: 8,
  },
  techBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  techBadge: {
    fontSize: 7,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    color: '#4b5563',
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 4,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#111111',
    color: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 2,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  educationItem: {
    marginBottom: 10,
  },
  eduTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111111',
  },
  eduInst: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 1,
  },
  honorItem: {
    marginBottom: 8,
  },
  honorTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#111111',
    marginBottom: 2,
  },
  honorMeta: {
    fontSize: 8,
    color: '#4b5563',
  },
  certItem: {
    marginBottom: 8,
  },
  certTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#111111',
    marginBottom: 2,
  },
  certMeta: {
    fontSize: 8,
    color: '#4b5563',
  }
});

export function EditorialResume({ data }) {
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
        {/* Top Banner */}
        <View style={styles.topBanner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.name}>{info?.full_name || 'Haikal Jibran Al Ghiffarry'}</Text>
            <Text style={styles.role}>{info?.role || 'Systems Architect & Full-stack Developer'}</Text>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.contactText}>{info?.email || 'hello@ghiffa.dev'}</Text>
            {info?.phone_number && <Text style={styles.contactText}>{info.phone_number}</Text>}
            {info?.social_links?.linkedin && (
              <Text style={styles.contactText}>
                {info.social_links.linkedin.replace('https://', '')}
              </Text>
            )}
            {info?.social_links?.github && (
              <Text style={styles.contactText}>
                {info.social_links.github.replace('https://', '')}
              </Text>
            )}
          </View>
        </View>

        {/* Main Section */}
        <View style={styles.mainSection}>
          {/* Left Column */}
          <View style={styles.leftCol}>
            {/* Profile */}
            <View>
              <Text style={styles.sectionHeader}>[ 01/ PROFILE ]</Text>
              <Text style={styles.profileText}>{(info?.about_content || '').replace(/\*/g, '')}</Text>
            </View>

            {/* Experience */}
            {experiences.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>[ 02/ EXPERIENCE ]</Text>
                {experiences.map((exp, idx) => {
                  const techList = Array.isArray(exp.tech_stack)
                    ? exp.tech_stack
                    : JSON.parse(exp.tech_stack || '[]');
                  return (
                    <View key={exp.id || idx} style={styles.experienceItem}>
                      <View style={styles.rowJustify}>
                        <Text style={styles.expTitle}>{exp.role}</Text>
                        <Text style={styles.expDate}>{exp.period}</Text>
                      </View>
                      <Text style={styles.expCompany}>{exp.company}</Text>
                      <Text style={styles.expDesc}>{exp.description}</Text>
                      {techList.length > 0 && (
                        <View style={styles.techBadgeContainer}>
                          {techList.map((tech, i) => (
                            <Text key={i} style={styles.techBadge}>
                              {tech}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Education (Moved here to rebalance layout) */}
            {educations.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.sectionHeader}>[ 03/ EDUCATION ]</Text>
                {educations.map((edu, idx) => (
                  <View key={edu.id || idx} style={styles.educationItem}>
                    <Text style={styles.expDate}>{edu.period}</Text>
                    <Text style={styles.eduTitle}>{edu.title}</Text>
                    <Text style={styles.eduInst}>{edu.institution}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightCol}>
            {/* Skills */}
            {skillsList.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>[ 04/ SKILLS ]</Text>
                <View style={styles.skillContainer}>
                  {skillsList.map((skill, i) => (
                    <Text key={i} style={styles.skillBadge}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Honors */}
            {honors.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>[ 05/ HONORS ]</Text>
                {honors.map((honor, idx) => (
                  <View key={honor.id || idx} style={styles.honorItem}>
                    <Text style={styles.honorTitle}>{honor.title}</Text>
                    <Text style={styles.honorMeta}>
                      {honor.institution} — {honor.period}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certs.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>[ 06/ CERTS ]</Text>
                {certs.map((cert, idx) => (
                  <View key={cert.id || idx} style={styles.certItem}>
                    <Text style={styles.certTitle}>{cert.title}</Text>
                    <Text style={styles.certMeta}>
                      {cert.institution} — {cert.period}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
