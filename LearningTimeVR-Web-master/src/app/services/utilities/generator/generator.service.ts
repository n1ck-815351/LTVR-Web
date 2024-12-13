/// This class is intended to generate default data within a newly provisioned organization.
import { Injectable } from '@angular/core';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { ClassroomService } from 'app/services/classroomService/classroom.service';
import { ContentService } from 'app/services/contentService/content.service';
import { LessonService } from 'app/services/lessonService/lesson.service';
import { SubjectService } from 'app/services/subjectService/subject.service';
import { MapService } from 'app/services/mapService/map.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  
  organizationId: string = '';
  
  demoData: string = `{
    "title": "Demo Classes",
    "searchTerm": "demo classes",
    "description": "This is a demo class which can be used to dive right into your immersive experience in Learning Time VR!",
    "id": "KSouoX3tCREep6WoIfPG",
    "createdBy": "SYSTEM_GENERATED",
    "dateCreated": "1684443091971",
    "dateUpdated": "1684443181091",
    "subjects": [
      {
        "title": "Biology 101:  8th Grade",
        "description": "This course immerses students in the captivating world of life sciences, exploring subjects from cell structures to genetics and ecosystems. By engaging with intriguing lessons, students cultivate an appreciation for biology and build a solid foundation for further scientific studies.",
        "classId": "KSouoX3tCREep6WoIfPG",
        "id": "CZP5hFO9hqX64eZ6fou9",
        "lessons": [
          {
            "id": "BdssE04jsBfEiMTSZ0zj",
            "subjectId": "CZP5hFO9hqX64eZ6fou9",
            "description": "Unpacking the concept of evolution, principles of natural selection, speciation, and evidence supporting evolutionary theory.",
            "title": "6 - Adapt and Survive: Evolution",
            "content": []
          },
          {
            "subjectId": "CZP5hFO9hqX64eZ6fou9",
            "title": "4 - From Single to Multicellular: Organisms and Systems",
            "description": "An examination of life's diversity through the lens of the five kingdoms and a closer look at the systems of the human body.",
            "id": "G75vaY7PYfuBN3pueL6m",
            "content": []
          },
          {
            "id": "MYgzYD17YJ0pLQQ2I6LN",
            "title": "2 - The Building Blocks: Cell Biology",
            "subjectId": "CZP5hFO9hqX64eZ6fou9",
            "description": "Study of cells, their structure, function, and key processes like photosynthesis and cellular respiration.",
            "content": []
          },
          {
            "subjectId": "CZP5hFO9hqX64eZ6fou9",
            "id": "abuCYedU2Pl7gTTvHouM",
            "title": "3 - Blueprint of Life: Genetics",
            "description": "Exploration of DNA, genes, and inheritance patterns, including an introduction to biotechnology.",
            "content": []
          },
          {
            "description": "Understanding the interconnectedness of life forms in ecosystems, including the flow of energy and human impacts.",
            "id": "fabDMQ0wyyW94MsQfrSz",
            "subjectId": "CZP5hFO9hqX64eZ6fou9",
            "title": "5 - The Web of Life: Ecosystems",
            "content": []
          },
          {
            "id": "vAmCrtspmaNT9110xhpa",
            "subjectId": "CZP5hFO9hqX64eZ6fou9",
            "description": "An overview of what biology is and why it is significant.",
            "title": "1- Introduction to Biology",
            "content": []
          }
        ]
      },
      {
        "classId": "KSouoX3tCREep6WoIfPG",
        "description": "These are classes to demonstrate how this media will be used in a classroom environment. [ CAN AI GENERATE A THUMBNAIL ]",
        "title": "Sample Classes",
        "id": "Ej1CRvSSfPUMifYIVqQ7",
        "lessons": [
          {
            "subjectId": "Ej1CRvSSfPUMifYIVqQ7",
            "title": "City of Rome - Virtual Field Trip",
            "description": "City of Rome - Virtual Field Trip",
            "id": "33SiBWY09h8h0IlfBZNK",
            "content": [
              {
                "contentFormatType": 0,
                "contentType": 7,
                "getURL": "https://www.youtube.com/watch?v=S-UAi_VA9Ck",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "title": "Diseases - Flat",
                "uploadMethod": 1,
                "description": "Diseases - Flat",
                "isStereoscopic": false,
                "id": "5M9kc4YAbmLGxLB3AeM5"
              },
              {
                "contentType": 6,
                "getURL": "https://docs.google.com/presentation/d/1j3a_xGsPcQ2XGjuvSsoSNTN_TdCwuDamRlc6g2-pfzY/edit?usp=sharing",
                "contentFormatType": 0,
                "title": "Cell Basics - Slideshow - Browser",
                "description": "Cell Basics - Slideshow - Browser",
                "isStereoscopic": false,
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "uploadMethod": 1,
                "id": "Fy8LpCS4Pd743WqzbFum"
              },
              {
                "id": "LF7r0gWKDAKQYxv9g7k5",
                "contentType": 0,
                "contentFormatType": 0,
                "uploadMethod": "1",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "title": "Cells 3",
                "description": "Cells 3",
                "getURL": "https://cdn.discordapp.com/attachments/1095920075594276934/1095921476374376580/Jimbo1368_an_opening_image_to_inspire_middle_school_students_to_8e3cced3-7330-4138-94fa-5ac917c4a744.png",
                "isStereoscopic": false
              },
              {
                "description": "Beating Heart",
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F9029%26date%3FSun_Jun%2004%202023%2010%3A12%3A57%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3FBeating%20heart.glb_%26file%3FBeating%20heart.glb?alt=media&token=9adcf95d-be7d-45f7-9fec-6b7d7939ffaf",
                "title": "Beating Heart",
                "uploadMethod": 0,
                "isStereoscopic": false,
                "contentFormatType": 0,
                "contentType": 4,
                "ref": "gs://learningtimevr-uploads/Production/contentPin?9029&date?Sun_Jun 04 2023 10:12:57 GMT-0400 (Eastern Daylight Time)&id?Beating heart.glb_&file?Beating heart.glb",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "id": "TAzg6SOblYqbAyRpMENS"
              },
              {
                "uploadMethod": 1,
                "contentFormatType": "1",
                "contentType": 7,
                "description": "360",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "title": "Animal Cell - 360 mono",
                "isStereoscopic": false,
                "getURL": "https://youtu.be/PzxxEVdM1xI",
                "id": "UWgcZd8y2As69Ppn4juz"
              },
              {
                "title": "Cells 2",
                "isStereoscopic": false,
                "contentFormatType": 0,
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "getURL": "https://cdn.discordapp.com/attachments/1095920075594276934/1095923108130603108/Jimbo1368_A_realistic_microscopic_photograph_of_a_cell_showcasi_bb88207a-6456-436d-844a-afa2107d85df.png",
                "description": "Cells 2",
                "contentType": 0,
                "uploadMethod": "1",
                "id": "iRGWOFONDyCgsGDJh4Du"
              },
              {
                "contentFormatType": 0,
                "isStereoscopic": false,
                "description": "Cells",
                "title": "Cells",
                "uploadMethod": "1",
                "getURL": "https://cdn.discordapp.com/attachments/1095920075594276934/1095923074416779285/Jimbo1368_A_realistic_microscopic_photograph_of_a_cell_showcasi_d7bc0ba2-38e0-4cdf-80cb-915029026097.png",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "contentType": 0,
                "id": "rFxeQDbcTBtzuQPonExk"
              }
            ]
          },
          {
            "description": "Learn all about the cells in the body",
            "title": "Biology - Cells in the Body",
            "subjectId": "Ej1CRvSSfPUMifYIVqQ7",
            "id": "o2HWm6wh5wP5ce8SM4yD",
            "content": [
              {
                "getURL": "https://www.youtube.com/watch?v=S-UAi_VA9Ck",
                "isStereoscopic": false,
                "description": "Diseases - Flat",
                "contentFormatType": 0,
                "contentType": 7,
                "uploadMethod": 1,
                "title": "Diseases - Flat",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "id": "5M9kc4YAbmLGxLB3AeM5"
              },
              {
                "isStereoscopic": false,
                "contentType": 6,
                "description": "Cell Basics - Slideshow - Browser",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "contentFormatType": 0,
                "uploadMethod": 1,
                "getURL": "https://docs.google.com/presentation/d/1j3a_xGsPcQ2XGjuvSsoSNTN_TdCwuDamRlc6g2-pfzY/edit?usp=sharing",
                "title": "Cell Basics - Slideshow - Browser",
                "id": "Fy8LpCS4Pd743WqzbFum"
              },
              {
                "isStereoscopic": false,
                "getURL": "https://cdn.discordapp.com/attachments/1095920075594276934/1095921476374376580/Jimbo1368_an_opening_image_to_inspire_middle_school_students_to_8e3cced3-7330-4138-94fa-5ac917c4a744.png",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "title": "Cells 3",
                "description": "Cells 3",
                "uploadMethod": "1",
                "contentType": 0,
                "contentFormatType": 0,
                "id": "LF7r0gWKDAKQYxv9g7k5"
              },
              {
                "uploadMethod": 0,
                "description": "Beating Heart",
                "contentFormatType": 0,
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F9029%26date%3FSun_Jun%2004%202023%2010%3A12%3A57%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3FBeating%20heart.glb_%26file%3FBeating%20heart.glb?alt=media&token=9adcf95d-be7d-45f7-9fec-6b7d7939ffaf",
                "contentType": 4,
                "isStereoscopic": false,
                "title": "Beating Heart",
                "ref": "gs://learningtimevr-uploads/Production/contentPin?9029&date?Sun_Jun 04 2023 10:12:57 GMT-0400 (Eastern Daylight Time)&id?Beating heart.glb_&file?Beating heart.glb",
                "id": "TAzg6SOblYqbAyRpMENS"
              },
              {
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "getURL": "https://youtu.be/PzxxEVdM1xI",
                "contentType": 7,
                "uploadMethod": 1,
                "title": "Animal Cell - 360 mono",
                "description": "360",
                "isStereoscopic": false,
                "contentFormatType": "1",
                "id": "UWgcZd8y2As69Ppn4juz"
              },
              {
                "contentFormatType": 0,
                "uploadMethod": "1",
                "isStereoscopic": false,
                "title": "Cells 2",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "getURL": "https://cdn.discordapp.com/attachments/1095920075594276934/1095923108130603108/Jimbo1368_A_realistic_microscopic_photograph_of_a_cell_showcasi_bb88207a-6456-436d-844a-afa2107d85df.png",
                "description": "Cells 2",
                "contentType": 0,
                "id": "iRGWOFONDyCgsGDJh4Du"
              },
              {
                "uploadMethod": "1",
                "title": "Cells",
                "description": "Cells",
                "contentFormatType": 0,
                "contentType": 0,
                "getURL": "https://cdn.discordapp.com/attachments/1095920075594276934/1095923074416779285/Jimbo1368_A_realistic_microscopic_photograph_of_a_cell_showcasi_d7bc0ba2-38e0-4cdf-80cb-915029026097.png",
                "lessonId": "o2HWm6wh5wP5ce8SM4yD",
                "isStereoscopic": false,
                "id": "rFxeQDbcTBtzuQPonExk"
              }
            ]
          }
        ]
      },
      {
        "description": "Media Testing",
        "title": "Media Testing",
        "classId": "KSouoX3tCREep6WoIfPG",
        "id": "aGYTJfxFCNX6JA46Wslq",
        "lessons": [
          {
            "subjectId": "aGYTJfxFCNX6JA46Wslq",
            "description": "360 Stereo",
            "title": "360 Stereo",
            "id": "GMW3FMF3OwnVWuWJPQmw",
            "content": [
              {
                "contentType": 3,
                "getURL": "https://www.youtube.com/watch?v=L_tqK4eqelA&t=70s",
                "title": "360 video - mono",
                "contentFormatType": 0,
                "id": "61V4EQ0eKJtzhM0WK1kG",
                "isStereoscopic": false,
                "description": "360 video - mono",
                "uploadMethod": "1",
                "lessonId": "PfS3YwFCWfAPWTliqGjp"
              },
              {
                "description": "Flat - youtube video",
                "uploadMethod": 1,
                "title": "Flat - youtube video",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentFormatType": 0,
                "isStereoscopic": false,
                "id": "GHs0XuAhSBpJLZoWpdFO",
                "getURL": "https://www.youtube.com/watch?v=921VbEMAwwY",
                "contentType": 7
              },
              {
                "isStereoscopic": false,
                "contentFormatType": 0,
                "ref": "gs://learningtimevr-uploads/Production/contentPin?8149&date?Thu_Jun 01 2023 22:32:11 GMT-0400 (Eastern Daylight Time)&id?vr-kids.png_&file?vr-kids.png",
                "description": "VR Classroom",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentType": 0,
                "title": "VR Classroom",
                "uploadMethod": 0,
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F8149%26date%3FThu_Jun%2001%202023%2022%3A32%3A11%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fvr-kids.png_%26file%3Fvr-kids.png?alt=media&token=a4a2f65e-1a51-49b5-967e-c249c59e2f6b",
                "id": "IlhlZnUV9MagGuyHZ37o"
              },
              {
                "contentFormatType": 0,
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "uploadMethod": 0,
                "description": "Field Trip Ship",
                "contentType": 4,
                "title": "Field Trip Ship",
                "isStereoscopic": false,
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F3618%26date%3FSun_Jun%2004%202023%2019%3A43%3A54%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fhammerhead_space_fighter.glb_%26file%3Fhammerhead_space_fighter.glb?alt=media&token=d7224a68-3d06-44c3-a488-06f8d0dcfff4",
                "ref": "gs://learningtimevr-uploads/Production/contentPin?3618&date?Sun_Jun 04 2023 19:43:54 GMT-0400 (Eastern Daylight Time)&id?hammerhead_space_fighter.glb_&file?hammerhead_space_fighter.glb",
                "id": "Z3vPIXJq6uZ31KUPJ0Co"
              },
              {
                "title": "360 Video",
                "uploadMethod": 1,
                "getURL": "https://www.youtube.com/watch?v=HNOT_feL27Y&list=PLdQAYG-lBLw0MvhHyMR7c71YrXummlcFL",
                "contentFormatType": "1",
                "description": "360",
                "contentType": 7,
                "isStereoscopic": false,
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "id": "upnOpzKNZxpgYAyy8PFk"
              },
              {
                "title": "YouTube Playlist",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "getURL": "https://www.youtube.com/watch?v=OTsqUNGFYlM&list=PL8HAkqKX065Bm4la3BM3C3bSkn-Xxu8Hp",
                "description": "YouTube Playlist",
                "uploadMethod": 1,
                "contentType": 6,
                "isStereoscopic": false,
                "contentFormatType": 0,
                "id": "wZ9m079DzvKellc896Mw"
              }
            ]
          },
          {
            "description": "360 standard",
            "title": "360 standard",
            "subjectId": "aGYTJfxFCNX6JA46Wslq",
            "id": "IAr9v8fbHjY9U8PDmFya",
            "content": [
              {
                "title": "360 video - mono",
                "description": "360 video - mono",
                "contentType": 3,
                "uploadMethod": "1",
                "contentFormatType": 0,
                "id": "61V4EQ0eKJtzhM0WK1kG",
                "isStereoscopic": false,
                "getURL": "https://www.youtube.com/watch?v=L_tqK4eqelA&t=70s",
                "lessonId": "PfS3YwFCWfAPWTliqGjp"
              },
              {
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "uploadMethod": 1,
                "description": "Flat - youtube video",
                "isStereoscopic": false,
                "contentType": 7,
                "contentFormatType": 0,
                "title": "Flat - youtube video",
                "id": "GHs0XuAhSBpJLZoWpdFO",
                "getURL": "https://www.youtube.com/watch?v=921VbEMAwwY"
              },
              {
                "title": "VR Classroom",
                "contentFormatType": 0,
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F8149%26date%3FThu_Jun%2001%202023%2022%3A32%3A11%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fvr-kids.png_%26file%3Fvr-kids.png?alt=media&token=a4a2f65e-1a51-49b5-967e-c249c59e2f6b",
                "ref": "gs://learningtimevr-uploads/Production/contentPin?8149&date?Thu_Jun 01 2023 22:32:11 GMT-0400 (Eastern Daylight Time)&id?vr-kids.png_&file?vr-kids.png",
                "contentType": 0,
                "description": "VR Classroom",
                "isStereoscopic": false,
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "uploadMethod": 0,
                "id": "IlhlZnUV9MagGuyHZ37o"
              },
              {
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "uploadMethod": 0,
                "contentFormatType": 0,
                "ref": "gs://learningtimevr-uploads/Production/contentPin?3618&date?Sun_Jun 04 2023 19:43:54 GMT-0400 (Eastern Daylight Time)&id?hammerhead_space_fighter.glb_&file?hammerhead_space_fighter.glb",
                "description": "Field Trip Ship",
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F3618%26date%3FSun_Jun%2004%202023%2019%3A43%3A54%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fhammerhead_space_fighter.glb_%26file%3Fhammerhead_space_fighter.glb?alt=media&token=d7224a68-3d06-44c3-a488-06f8d0dcfff4",
                "title": "Field Trip Ship",
                "contentType": 4,
                "isStereoscopic": false,
                "id": "Z3vPIXJq6uZ31KUPJ0Co"
              },
              {
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentType": 7,
                "uploadMethod": 1,
                "contentFormatType": "1",
                "isStereoscopic": false,
                "getURL": "https://www.youtube.com/watch?v=HNOT_feL27Y&list=PLdQAYG-lBLw0MvhHyMR7c71YrXummlcFL",
                "description": "360",
                "title": "360 Video",
                "id": "upnOpzKNZxpgYAyy8PFk"
              },
              {
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "isStereoscopic": false,
                "uploadMethod": 1,
                "title": "YouTube Playlist",
                "contentFormatType": 0,
                "contentType": 6,
                "getURL": "https://www.youtube.com/watch?v=OTsqUNGFYlM&list=PL8HAkqKX065Bm4la3BM3C3bSkn-Xxu8Hp",
                "description": "YouTube Playlist",
                "id": "wZ9m079DzvKellc896Mw"
              }
            ]
          },
          {
            "description": "All Media Types",
            "id": "PfS3YwFCWfAPWTliqGjp",
            "title": "All Media Types",
            "subjectId": "aGYTJfxFCNX6JA46Wslq",
            "content": [
              {
                "id": "61V4EQ0eKJtzhM0WK1kG",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentFormatType": 0,
                "getURL": "https://www.youtube.com/watch?v=L_tqK4eqelA&t=70s",
                "contentType": 3,
                "description": "360 video - mono",
                "uploadMethod": "1",
                "title": "360 video - mono",
                "isStereoscopic": false
              },
              {
                "uploadMethod": 1,
                "isStereoscopic": false,
                "description": "Flat - youtube video",
                "contentFormatType": 0,
                "title": "Flat - youtube video",
                "contentType": 7,
                "getURL": "https://www.youtube.com/watch?v=921VbEMAwwY",
                "id": "GHs0XuAhSBpJLZoWpdFO",
                "lessonId": "PfS3YwFCWfAPWTliqGjp"
              },
              {
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F8149%26date%3FThu_Jun%2001%202023%2022%3A32%3A11%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fvr-kids.png_%26file%3Fvr-kids.png?alt=media&token=a4a2f65e-1a51-49b5-967e-c249c59e2f6b",
                "contentType": 0,
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "ref": "gs://learningtimevr-uploads/Production/contentPin?8149&date?Thu_Jun 01 2023 22:32:11 GMT-0400 (Eastern Daylight Time)&id?vr-kids.png_&file?vr-kids.png",
                "isStereoscopic": false,
                "title": "VR Classroom",
                "description": "VR Classroom",
                "uploadMethod": 0,
                "contentFormatType": 0,
                "id": "IlhlZnUV9MagGuyHZ37o"
              },
              {
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F3618%26date%3FSun_Jun%2004%202023%2019%3A43%3A54%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fhammerhead_space_fighter.glb_%26file%3Fhammerhead_space_fighter.glb?alt=media&token=d7224a68-3d06-44c3-a488-06f8d0dcfff4",
                "ref": "gs://learningtimevr-uploads/Production/contentPin?3618&date?Sun_Jun 04 2023 19:43:54 GMT-0400 (Eastern Daylight Time)&id?hammerhead_space_fighter.glb_&file?hammerhead_space_fighter.glb",
                "contentFormatType": 0,
                "uploadMethod": 0,
                "contentType": 4,
                "isStereoscopic": false,
                "title": "Field Trip Ship",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "description": "Field Trip Ship",
                "id": "Z3vPIXJq6uZ31KUPJ0Co"
              },
              {
                "isStereoscopic": false,
                "getURL": "https://www.youtube.com/watch?v=HNOT_feL27Y&list=PLdQAYG-lBLw0MvhHyMR7c71YrXummlcFL",
                "title": "360 Video",
                "description": "360",
                "contentType": 7,
                "uploadMethod": 1,
                "contentFormatType": "1",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "id": "upnOpzKNZxpgYAyy8PFk"
              },
              {
                "uploadMethod": 1,
                "description": "YouTube Playlist",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentType": 6,
                "getURL": "https://www.youtube.com/watch?v=OTsqUNGFYlM&list=PL8HAkqKX065Bm4la3BM3C3bSkn-Xxu8Hp",
                "isStereoscopic": false,
                "title": "YouTube Playlist",
                "contentFormatType": 0,
                "id": "wZ9m079DzvKellc896Mw"
              }
            ]
          },
          {
            "subjectId": "aGYTJfxFCNX6JA46Wslq",
            "title": "180 Stereo",
            "description": "youtube",
            "id": "ijPwlaRnuZGg3WpngSYC",
            "content": [
              {
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentType": 3,
                "contentFormatType": 0,
                "getURL": "https://www.youtube.com/watch?v=L_tqK4eqelA&t=70s",
                "id": "61V4EQ0eKJtzhM0WK1kG",
                "uploadMethod": "1",
                "title": "360 video - mono",
                "isStereoscopic": false,
                "description": "360 video - mono"
              },
              {
                "contentFormatType": 0,
                "description": "Flat - youtube video",
                "uploadMethod": 1,
                "getURL": "https://www.youtube.com/watch?v=921VbEMAwwY",
                "id": "GHs0XuAhSBpJLZoWpdFO",
                "isStereoscopic": false,
                "contentType": 7,
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "title": "Flat - youtube video"
              },
              {
                "ref": "gs://learningtimevr-uploads/Production/contentPin?8149&date?Thu_Jun 01 2023 22:32:11 GMT-0400 (Eastern Daylight Time)&id?vr-kids.png_&file?vr-kids.png",
                "title": "VR Classroom",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentFormatType": 0,
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F8149%26date%3FThu_Jun%2001%202023%2022%3A32%3A11%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fvr-kids.png_%26file%3Fvr-kids.png?alt=media&token=a4a2f65e-1a51-49b5-967e-c249c59e2f6b",
                "description": "VR Classroom",
                "contentType": 0,
                "isStereoscopic": false,
                "uploadMethod": 0,
                "id": "IlhlZnUV9MagGuyHZ37o"
              },
              {
                "uploadMethod": 0,
                "ref": "gs://learningtimevr-uploads/Production/contentPin?3618&date?Sun_Jun 04 2023 19:43:54 GMT-0400 (Eastern Daylight Time)&id?hammerhead_space_fighter.glb_&file?hammerhead_space_fighter.glb",
                "title": "Field Trip Ship",
                "description": "Field Trip Ship",
                "contentFormatType": 0,
                "getURL": "https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/Production%2FcontentPin%3F3618%26date%3FSun_Jun%2004%202023%2019%3A43%3A54%20GMT-0400%20(Eastern%20Daylight%20Time)%26id%3Fhammerhead_space_fighter.glb_%26file%3Fhammerhead_space_fighter.glb?alt=media&token=d7224a68-3d06-44c3-a488-06f8d0dcfff4",
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "contentType": 4,
                "isStereoscopic": false,
                "id": "Z3vPIXJq6uZ31KUPJ0Co"
              },
              {
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "description": "360",
                "isStereoscopic": false,
                "getURL": "https://www.youtube.com/watch?v=HNOT_feL27Y&list=PLdQAYG-lBLw0MvhHyMR7c71YrXummlcFL",
                "contentFormatType": "1",
                "contentType": 7,
                "uploadMethod": 1,
                "title": "360 Video",
                "id": "upnOpzKNZxpgYAyy8PFk"
              },
              {
                "isStereoscopic": false,
                "lessonId": "PfS3YwFCWfAPWTliqGjp",
                "description": "YouTube Playlist",
                "uploadMethod": 1,
                "contentType": 6,
                "getURL": "https://www.youtube.com/watch?v=OTsqUNGFYlM&list=PL8HAkqKX065Bm4la3BM3C3bSkn-Xxu8Hp",
                "title": "YouTube Playlist",
                "contentFormatType": 0,
                "id": "wZ9m079DzvKellc896Mw"
              }
            ]
          }
        ]
      }
    ]
  }`

  constructor(
    public classService: ClassroomService,
    public mapService: MapService,
    public subjectService: SubjectService,
    public lessonsService: LessonService,
    public contentService: ContentService
  ) {  }

  public async testData() {
    const demoClass = JSON.parse(this.demoData) as Classroom;
    this.generateDemoContent([demoClass]);
  }

  // This class will create a JSON string representation of any element_class object
  // This object will include all sub-objects; element_subject, element_lesson, element_content
  public async generateJSONByClassId(classId: string) {
    // TEST ID FOR JIM'S CLASS: 'KSouoX3tCREep6WoIfPG'
    if (!this.organizationId || this.organizationId == '') {
      return;
    }
    await this.classService.getClassById(classId).then(async classData =>{
      if (classData.id) {
        await this.subjectService.getCollectionByClassId(classData.id).then(async subjectData =>{
          
        classData.subjects = subjectData;
        if (classData.subjects && classData.subjects.length > 0) {
          for(let i = 0; i < classData.subjects.length; i++) {
            let _s = classData.subjects[i];
            if (_s.id) {
              await this.lessonsService.getCollectionBySubjectId(_s?.id).then(async lessonData => {
                if (classData && classData.subjects) {
                  classData.subjects[i].lessons = lessonData ?? [];
                  if (lessonData && lessonData.length > 0) {

                    for(let j = 0; j < lessonData.length; j++) {
                      let _l = lessonData[i];
                      if (_l.id) {
                        await this.contentService.getCollectionByLessonId(_l.id).then(contentData => {
                          if (classData && classData.subjects[i].lessons) {
                            classData.subjects[i].lessons[j].content = contentData;
                          }
                        })
                      }
                    }
                  }
                }
              })
            }
          }
        }})
      }
      const json = JSON.stringify(classData);
      let _currentIndex = 0;
      const incrementFactor = 4000;
      for(let c = 0; _currentIndex < json.length; c += incrementFactor) {
        const length = json.length;
        const remaining = (length - _currentIndex - incrementFactor);
        const target = remaining > incrementFactor ? incrementFactor : remaining;

        if (remaining === 0) { break; }
        const chunk = json.substring(_currentIndex, target);
        console.log(chunk);
        _currentIndex+=target;
      }
    });
  }

  public async createDemoClass(_class: any){
    let _c: any = [];
    await this.classService.CreateClass(_class, false).then((_data)=> {
      if (_data) {
        _c = _data;
      }
    })
    _c.subjects = _class.subjects;
    console.log('CLASS GENERATED: ',_c)
    return _c;
  }

  public async createDemoSubjects(_subject: any){
    let _s: any = [];
    await this.subjectService.createSubject(_subject).then((_data)=> {
      if (_data) {
        _s = _data;
      }
    })
    _s.lessons = _subject.lessons;
    console.log('SUBJECT GENERATED: ', _s)
    return _s;
  }

  public async createDemoLessons(_lesson: any){
    let _l: any = [];
    await this.lessonsService.create(_lesson, _l.subjectId).then((_data)=> {
      if (_data) {
        _l = _data;
      }
    })
    _l.content = _lesson.content;
    console.log('LESSON GENERATED: ', _l)
    return _l;
  }

  public async generateDemoContent(demoClasses: Classroom[]) {
    demoClasses.forEach(async (_c) => {
      return await this.createDemoClass(_c).then(async _createdClass => {
        const c = _createdClass as Classroom;
        if (c.id && c.subjects && c.subjects.length > 0) {
          
          c.subjects.forEach(async _s => {

            _s.classId = c.id;
            await this.createDemoSubjects(_s).then(async (s: ClassroomSubject) => {
              if (s.id && s.lessons && s.lessons.length > 0) {

                s.lessons.forEach(async (_l: ClassroomLesson) => {

                  _l.subjectId = s.id;
                  await this.createDemoLessons(_l).then(async (l: ClassroomLesson) => {
                    if (l.id && l.content && l.content.length > 0) {

                      l.content.forEach(async (c: LessonContent) => {
                        c.lessonId = l.id;
                        this.contentService.create(c);
                      })
                    }
                  });
                });
              }
            });
          })
        }
      });
    })
  }
}
