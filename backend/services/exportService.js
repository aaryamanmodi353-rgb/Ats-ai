import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export class ExportService {
  static async generateSingleColumnDocx(resumeData) {
    const sectionsChildren = [];

    // 1. Contact Header (Single Column Centered)
    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resumeData.contact.fullName || 'Candidate Name',
            bold: true,
            size: 36, // 18pt
            font: 'Arial',
            color: '0F172A',
          }),
        ],
      })
    );

    const contactLine = [
      resumeData.contact.email,
      resumeData.contact.phone,
      resumeData.contact.location,
      resumeData.contact.linkedin,
    ].filter(Boolean).join('  |  ');

    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 280 },
        children: [
          new TextRun({
            text: contactLine,
            size: 20, // 10pt
            font: 'Arial',
            color: '475569',
          }),
        ],
      })
    );

    // Helper for Section Headings
    const addSectionHeading = (title) => {
      sectionsChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 24, // 12pt
              font: 'Arial',
              color: '1E3A8A', // Navy blue
            }),
          ],
        })
      );
    };

    // 2. Professional Summary
    if (resumeData.summary) {
      addSectionHeading('Professional Summary');
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 22, // 11pt
              font: 'Arial',
              color: '1E293B',
            }),
          ],
        })
      );
    }

    // 3. Technical Skills (Sequential Plain Text)
    addSectionHeading('Technical Skills & Tools');
    const skillsLine = [
      resumeData.skills.hardSkills?.length ? `Hard Skills: ${resumeData.skills.hardSkills.join(', ')}` : '',
      resumeData.skills.tools?.length ? `Tools & Technologies: ${resumeData.skills.tools.join(', ')}` : '',
      resumeData.skills.softSkills?.length ? `Core Competencies: ${resumeData.skills.softSkills.join(', ')}` : '',
    ].filter(Boolean);

    skillsLine.forEach((line) => {
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: line,
              size: 21, // 10.5pt
              font: 'Arial',
              color: '1E293B',
            }),
          ],
        })
      );
    });

    // 4. Work Experience
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      addSectionHeading('Work Experience');
      resumeData.workExperience.forEach((work) => {
        // Role & Company header line
        sectionsChildren.push(
          new Paragraph({
            spacing: { before: 140, after: 60 },
            children: [
              new TextRun({
                text: `${work.title} | ${work.company}`,
                bold: true,
                size: 22, // 11pt
                font: 'Arial',
                color: '0F172A',
              }),
              new TextRun({
                text: `  (${work.startDate} – ${work.current ? 'Present' : work.endDate})`,
                italics: true,
                size: 20, // 10pt
                font: 'Arial',
                color: '64748B',
              }),
            ],
          })
        );

        // Bullets
        work.bullets.forEach((bullet) => {
          sectionsChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 21, // 10.5pt
                  font: 'Arial',
                  color: '334155',
                }),
              ],
            })
          );
        });
      });
    }

    // 5. Education
    if (resumeData.education && resumeData.education.length > 0) {
      addSectionHeading('Education & Credentials');
      resumeData.education.forEach((edu) => {
        sectionsChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: `${edu.degree} — ${edu.institution}`,
                bold: true,
                size: 21, // 10.5pt
                font: 'Arial',
                color: '0F172A',
              }),
              new TextRun({
                text: ` (${edu.graduationDate})`,
                italics: true,
                size: 20,
                font: 'Arial',
                color: '64748B',
              }),
            ],
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sectionsChildren,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }
}
