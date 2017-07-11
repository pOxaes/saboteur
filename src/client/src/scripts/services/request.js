import Promise from "bluebird";

const get = url =>
  new Promise((resolve, reject) => {
    fetch(url).then(res => {
      if (!res.ok) {
        reject(res);
      }
      resolve(res.json());
    });
  });

export default {
  get
};
