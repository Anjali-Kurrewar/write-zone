import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

//get all the mdx file from the dir
function getMDXFile (dir: string) {
    return fs.readdirSync(dir).filter((file)=> path.extname(file) === '.mdx');
} 

//Read data from those files 
function readMDXFile(filePath: fs.PathOrFileDescriptor) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return matter(rawContent);
}

//Present the data and metadata from the file 
function getMDXdata(dir: string){
    const mdxfiles = getMDXFile(dir);

    return mdxfiles.map((file) =>{
        const {data: metadata, content} = readMDXFile(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));
        return {slug, metadata, content};
    });
}

export function getblogpost () {
    return getMDXdata (path.join(process.cwd(),"src","app","blog","contents"));
}

export function getTermOfServices () {
    return getMDXdata(path.join(process.cwd(),"src","app","terms-of-services"));
}

export function getPrivacyPolicy () {
    return getMDXdata(path.join(process.cwd(),"src","app","privacy-policy"));
}

export function formatDate (date:string, includeRelative = false) {
    const currentDate = new Date();
    if (!date.includes("T")){
        date = `${date}T00:00:00`;
    }

    const targetDate = new Date(date);

    const yearsago = currentDate.getFullYear() - targetDate.getFullYear();
    const monthsago = currentDate.getMonth() - targetDate.getMonth();
    const daysago = currentDate.getDate() - targetDate.getDate();

    let  formattedDate = "";

    if (yearsago > 0){
        formattedDate = `${yearsago}y ago`;
    }
    else if (monthsago > 0) {
        formattedDate = `${monthsago}months ago`;
    }
    else if (daysago > 0) {
        formattedDate = `${daysago} days ago`;
    }
    else {
        formattedDate = "Today";
    }

    const fullDate = targetDate.toLocaleDateString("en-us",{
        month: "long",
        day: "numeric",
        year: "numeric"
    })

    if (!includeRelative) {
        return fullDate;
    }
    return `${formattedDate}, ${fullDate}`;
}