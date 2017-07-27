const onRes = res => {
  if (!res.ok) {
    throw res;
  }
  return res.json();
};

const get = url => fetch(url).then(onRes);

const post = (url, data) =>
  fetch(url, {
    method: "POST",
    body: data || {}
  }).then(onRes);

export default {
  get,
  post
};
