export type CommunityProjectMeta={id:string;title:string;technologies:string[];authorId:string;courseId:string|null}
const rules:Array<[string,RegExp]>=[
 ['Desarrollo Web',/react|next|html|css|javascript|typescript|web/i],
 ['Python',/python|flet|django|flask/i],
 ['Bases de Datos',/sql|sqlite|postgres|supabase|mongo/i],
 ['Inteligencia Artificial',/\bia\b|\bai\b|inteligencia artificial|machine learning/i],
 ['Juegos',/godot|unity|juego|game/i],
 ['Automatización',/automatiz/i],
 ['Aplicaciones',/aplicaci|app/i],
]
export const normalizeTechnology=(value:string)=>value.trim().replace(/\s+/g,' ')
export function projectCategories(technologies:string[]){const text=technologies.join(' ');const values=rules.filter(([,rule])=>rule.test(text)).map(([category])=>category);return values.length?values:['Otros']}
export function categoryCounts(projects:CommunityProjectMeta[]){const counts=new Map<string,number>();for(const project of projects)for(const category of projectCategories(project.technologies))counts.set(category,(counts.get(category)??0)+1);return [...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'es'))}
export function technologyCounts(projects:CommunityProjectMeta[]){const values=new Map<string,number>();for(const project of projects)for(const item of project.technologies){const technology=normalizeTechnology(item);if(technology)values.set(technology,(values.get(technology)??0)+1)}return [...values].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'es'))}
export function filterCommunityProjects<T extends CommunityProjectMeta & {authorName:string;courseTitle:string|null}>(projects:T[],filters:{q?:string;category?:string;technology?:string;course?:string}){
 const q=filters.q?.trim().toLocaleLowerCase('es')??''
 return projects.filter(project=>{
  const haystack=[project.title,project.authorName,project.courseTitle??'',...project.technologies].join(' ').toLocaleLowerCase('es')
  return(!q||haystack.includes(q))&&(!filters.category||projectCategories(project.technologies).includes(filters.category))&&(!filters.technology||project.technologies.some(value=>normalizeTechnology(value).toLocaleLowerCase('es')===filters.technology!.toLocaleLowerCase('es')))&&(!filters.course||project.courseId===filters.course)
 })
}
