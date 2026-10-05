import { describe, expect, it } from 'vitest'
import { categoryCounts, filterCommunityProjects, technologyCounts } from './project-community'

const projects=[
 {id:'one',title:'App Python',technologies:['Python','SQLite'],authorId:'author-a',courseId:'course-a',authorName:'Ana',courseTitle:'Python Intermedio'},
 {id:'two',title:'Sitio React',technologies:['React','TypeScript'],authorId:'author-b',courseId:null,authorName:'Beto',courseTitle:null},
]
describe('datos de la comunidad de proyectos',()=>{
 it('deriva categorías y tecnologías solo de proyectos publicados recibidos',()=>{expect(categoryCounts(projects)).toEqual(expect.arrayContaining([['Python',1],['Desarrollo Web',1],['Bases de Datos',1]]));expect(technologyCounts(projects)).toEqual(expect.arrayContaining([['Python',1],['React',1],['SQLite',1]]))})
 it('filtra por tecnología, curso, categoría y búsqueda sin requerir curso',()=>{expect(filterCommunityProjects(projects,{technology:'python'}).map(project=>project.id)).toEqual(['one']);expect(filterCommunityProjects(projects,{course:'course-a'}).map(project=>project.id)).toEqual(['one']);expect(filterCommunityProjects(projects,{category:'Desarrollo Web'}).map(project=>project.id)).toEqual(['two']);expect(filterCommunityProjects(projects,{q:'beto'}).map(project=>project.id)).toEqual(['two'])})
})
