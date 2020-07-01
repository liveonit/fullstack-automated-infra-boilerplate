const fs = require("fs");
const path = require("path");
const process = require("process");
const handlebars = require("handlebars");

handlebars.registerHelper('eq', function (value, value2) {
  return value === value2;
});

const templatesDir = process.env.TEMPLATES_DIR;
const renderedDir = process.env.RENDERED_DIR;
// Make an async function that gets executed immediately

const createTemplates = (templatesDir, renderedDir) => {
  const files = fs.readdirSync(templatesDir);
  for (const file of files) {
    const fromPath = path.join(templatesDir, file);
    const toPath = path.join(renderedDir, file);
    const stat = fs.statSync(fromPath);
    if (stat.isFile()) {
      const source = fs.readFileSync(fromPath, "utf-8");
      const template = handlebars.compile(source);
      const result = template(process.env);

      fs.mkdirSync(path.dirname(toPath), { recursive: true })
      console.log("beforeWrite toPath", toPath);
      fs.writeFileSync(toPath, result);
    } else if (stat.isDirectory()) {
      createTemplates(fromPath, toPath);
    }
  }
};

try {
  createTemplates(templatesDir, renderedDir);
} catch (err) {
  console.error(err);
}
