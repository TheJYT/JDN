"use strict";

const fs = require("fs");
const formidable = require("formidable");
const uuid = require('uuid').v4();
const path = require('path');

exports.upload = async (req, res) => {
  const form = formidable();
  form.parse(req, async (_err, fields, files) => {
    if (files.file) {
        if(files.file.size > 20971520){
            return res.status(413).json({ success: false, message: "File exceeds the 20MB file limit!" });
        }
        var id = uuid;
        const oldPath = files.file.path;
        const ext = files.file.name.split(".");
        const newPath = `./uploads/${id}.${ext[1]}`;
        const rawData = fs.readFileSync(oldPath, (err, data) => {
            if(err) throw err;
        });

        fs.writeFile(newPath, rawData, (err, data) => {
            if(err) throw err;
        });

    } else {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, fileID: id, url: "https://cdn.thejyt.xyz/api/v1/files/" + id + "?filename=" + files.file.name.split(".")[0] });
  });
};

exports.get = (req, res) => {
    var id = req.params.fileID;
    fs.readdir('./uploads', (err, files) => {
        if(err) throw err;
        var regex = new RegExp("(" + id + ")+(.*)$", "g")
        const match = files.find(value => value.match(regex));
        if(match){
            if(req.query.filename){
                res.status(200).download(path.join(__dirname, '../uploads', match), req.query.filename + "." + match.split("."));
            }
            else{
                res.status(200).sendFile(path.join(__dirname, '../uploads', match));
            }
        }
        else{
            res.sendStatus(404);
        }
    });
};
