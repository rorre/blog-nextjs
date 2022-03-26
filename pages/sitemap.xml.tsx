import { getPosts } from '../utils/postHelper'
import { Post } from '../utils/types/Post'

function generateSiteMap(posts: Post[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <!--We manually set the two URLs we know already-->
       <url>
           <loc>https://blog.rorre.xyz/</loc>
           <lastmod>2022-03-26T13:52:58+00:00</lastmod>
           <priority>1.00</priority>
       </url>
       ${posts
           .map(({ Slug }) => {
               return `
         <url>
             <loc>https://blog.rorre.xyz/post/${Slug}</loc>
             <priority>0.80</priority>
         </url>
       `
           })
           .join('')}
     </urlset>
   `
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    const posts = getPosts()

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts)

    res.setHeader('Content-Type', 'text/xml')
    // we send the XML to the browser
    res.write(sitemap)
    res.end()

    return {
        props: {},
    }
}

export default SiteMap
