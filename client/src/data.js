import moment from 'moment';

const contentPost = {
  header: {
    title: 'Tiêu đề',
    author: 'Người đăng',
    categories: 'Danh mục',
    thumbnail: 'Ảnh bìa',
    date: 'Ngày đăng'
  },
  data: [
    {
      title: 'Lập trình thật dễ dàng',
      author: 'Võ Hoài Sơn',
      categories: [
        'Học tập'
      ],
      thumbnail: 'Ảnh bìa',
      date: moment()
    },
    {
      title: 'Làm thế nào để có cuộc sống lành mạnh',
      author: 'Võ Hoài Sơn',
      categories: [
        'Sống khoẻ'
      ],
      thumbnail: 'Ảnh bìa',
      date: moment()
    },
    {
      title: 'Học tiếng Anh đơn giản hơn với những thủ thuật sau',
      author: 'Võ Hoài Sơn',
      categories: [
        'Tip'
      ],
      thumbnail: 'Ảnh bìa',
      date: moment()
    }
  ]
};

export { contentPost };