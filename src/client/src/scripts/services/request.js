import Promise from "bluebird";

const onRes = (resolve, reject) => res => {
  if (!res.ok) {
    reject(res);
  }
  resolve(res.json());
};

const get = url =>
  new Promise((resolve, reject) => {
    fetch(url).then(onRes(resolve, reject));
  });

const post = (url, data) =>
  new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: data
    }).then(onRes(resolve, reject));
  });

export default {
  get,
  post
};
