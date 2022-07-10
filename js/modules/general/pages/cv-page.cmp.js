'use strict';

const CVSection = {
  name: 'cv-section',
  // components: {CVSection},
  props: ['section'],
  template: `
    <div class="cv-section">
      <p class="title">{{section.title}}</p>
      <ul class="content">
        <li A-for="curr in section.content">
          <p A-if="typeof(curr) === 'string'" class="content" key="{{curr.title || curr}}">{{curr}}</p>
          <CVSection A-if="typeof(curr) === 'object'" section="{{curr}}" key="{{curr.title || curr}}"/>
        </li>
      </ul>
    </div>
  `
}
CVSection.components = { CVSection };

export default {
    name: 'cv-page',
    components: {CVSection},
    template: `
        <main class="app-main container flex column align-center space-around">
            <div class="flex align-start space-between wrap width-all cv-head">
              <h2>{{cvData.title}}</h2>
              <div>
                <p>Mobile: {{cvData.info.mobile}}</p>
                <p>Email: {{cvData.info.email}}</p>
              </div>
            </div>
            <CVSection A-for="curr of cvData.sections" key="{{curr.title}}" section="{{curr}}"/>
        </main>
    `,
    style: {
      'padding-top': '20px',
      '.cv-head': {
        'margin-bottom': '30px',
        gap: '20px'
      },
      '.cv-section': {
        width: '100%',
        display: 'flex',
        '.title': {
          width: '110px',
          color: 'black',
          'font-weight': 'bold',
          'margin-bottom': '10px'
        },
        '.content': {
            flex: 1
        },
        'margin-bottom': '20px',
        '.cv-section': {
          'flex-direction': 'column',
          '.title': {
            // color: 'black',,
            'font-weight': 'unset',
            width: '100%'
          }
        },
        '@media (max-width: 700px)': {
          'flex-direction': 'column',
          '.title': {
            width: '100%',
          }
        },
        ul: {
          margin: 0,
          padding: 0,
          'padding-left': '20px'
        }
      }
    },
    state: {
      cvData: {
        title: 'Aviv Issachar - C.V',
        info: {
          mobile: '+972-50-207-5843',
          email: 'avivissachar73@gmail.com'
        },
        sections: [
          {
            title: 'Profile',
            content: [
              `Highly motivated full-stack engineer with vast experience in various web development technologies, techniques, and methodologies. Diligent worker with strong interpersonal skills.\nMusician, saxophone player and a composer.`
            ]
          },
          {
            title: 'Experience',
            content: [
              {
                title: 'Full-Stack Engineer, Mr. Bit | Oct 2020 – Ongoing',
                content: [
                  `Developing web applications and servers using the most updated technologies for different customers, such as VueJs, ReactJs, Node and expressJs, Scss, Docker, etc...`,
                  `Worked on a project for an enterprise company in the vehicle business.`
                ]
              },
              {
                title: 'Full-Stack Course Tutor, Mr. Bit’s Coding-Academy course | Jan 2020 – Oct 2020',
                content: [
                  `Lecturer, instructor, and mentor.`,
                  `Wrote code reviews and provided personal guidance to students.`,
                  `Course main lecture and instructor.`,
                  `Taught an external VueJs advanced course for experienced programmers.`
                ]
              },
              {
                title: `Tactical Controller, Navy's Main Operational Command Room, IDF | Nov 2016 – Jul 2019`,
                content: [
                  `Staffing the command room as a tactical controller.`,
                  `Controllers are the link between the headquarters and the various sea arm. The position is classified and challenging, including operating advanced technological systems and taking part in operational activities of the Navy.`,
                  `Finished my service as a shift officer, responsible for one of the main command room desk's activity and management.`
                ]
              }
            ]
          },
          {
            title: 'Education',
            content: [
              {
                title: 'Rimon music school | Nov 2021 – Ongoing',
                content: [`Studying Jazz music as a saxophone player, music production and songwriting.`]
              },
              {
                title: `Full-Stack Development Course, Mr. Bit's Coding-Academy | Sep – Dec 2019`,
                content: [`Full-Stack development course, mainly in JavaScript, including lots of frameworks, libraries, work methods and coding design.`]
              },
              {
                title: `The Jerusalem Academy of Music and Dance High School, Jerusalem | 2013 - 2016:`,
                content: [
                  `Attended the Conservatory's excellence program and studied academic music theory courses in the Academy's university.`,
                  `Concentrated in music and specialized in playing Saxophone.`,
                  `Played in the National Youth Israeli Orchestra, and in the Jerusalem Saxophone Quartet of Prof. Gersh Geller.`,
                  `Was a Scouts group leader and took a big part in the Scouts' social activities.`
                ]
              }
            ]
          },
          {
            title: 'Skills',
            content: [
              `Diligent self-learner with the ability to grasp new technologies and concepts quickly.`,
              `Highly experienced with Full-Stack development in JavaScript, including advanced technologies.`,
              `Frontend skills: Vue, React, Angular, SASS, typescript`,
              `Backend skills: NodeJs, expressJs, Rest API, modgoDB, SQL`,
              `Devops skills: Experienced with Docker.`,
              `Strong lecturing, teaching and mentoring skills.`,
              `Experienced with Python.`
            ]
          },
          {
            title: 'Hobbies',
            content: [
              `Playing and composing music`,
              `Sports outdoors`,
              `Hiking and traveling`,
              `Logic games and puzzles such as the Rubik's Cube`,
              `In my free time I write code and develop Js libraries. My biggest project so far: a Js UI-Framework such as VueJs`
            ]
          },
          {
            title: 'Languages',
            content: [
              `Hebrew – mother tongue`,
              `English – proficient`
            ]
          }
        ]
      }
    }
}