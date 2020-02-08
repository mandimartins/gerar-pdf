const pdfPrinter = require('pdfmake');

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Bold.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    boldItalics: 'fonts/Roboto-BoldItalic.ttf'
  }
};

const express = require('express');
const app = express();

const lines = [];
lines.push([
  {
    text: 'Nome',
    style: 'header' //point to the styles
  },
  {
    text: 'E-mail',
    style: 'header'
  },
  {
    text: 'Situação',
    style: 'header'
  }
]); //Defining the header

for (let i = 0; i < 300; i++) {
  let ativo = 'Ativo';
  if (i % 2 == 0) {
    ativo = { text: 'Inativo', style: 'inativo' };
  }
  lines.push([`John Doe ${i}`, `john_${i}@gmail.com`, ativo]); //The body content
}

const printer = new pdfPrinter(fonts);
const docDefinition = {
  content: [
    {
      image: 'images/logo.png',
      fit: [70, 70]
      //   width: 100,
      //   height: 80
    },
    { text: 'My content is a text' },
    {
      table: {
        widths: ['*', '*', 100],
        body: lines
      }
    }
  ],
  styles: {
    //Define styles
    header: {
      fontSize: 20,
      bold: true
    },
    inativo: {
      fontSize: 14,
      bold: true
    }
  },
  footer: (page, pages) => {
    return {
      columns: [
        'Texto de exemplo do footer do documento',
        {
          alignment: 'right',
          text: [
            { text: page.toString(), italics: true },
            'de',
            { text: pages.toString(), italics: true }
          ]
        }
      ],
      margin: [40, 0]
    };
  }
};

app.get('/get/:name', (req, res) => {
  const pdf = printer.createPdfKitDocument({
    content: 'Olá ' + req.params.name
  });

  //   res.header('Content-disposition', 'inline; filename=meu-pdf.pdf');
  res.header('Content-disposition', 'attachment; filename=meu-pdf.pdf');
  res.header('Content-type', 'application/pdf');
  pdf.pipe(res);
  pdf.end();
});

// const pdf = printer.createPdfKitDocument(docDefinition);

// const fs = require('fs');

// pdf.pipe(fs.createWriteStream('doc.pdf'));
// pdf.end();

app.listen(3000),
  () => {
    console.log('Server is running...');
  };
