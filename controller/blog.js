const { exec } = require('../db/mysql')
const xss = require('xss')

const getList = (author, keyword) => {
  let sql = 'select * from blogs where 1 = 1 ' // where 1 = 1 占位

  if (author) {
    sql += `and author = '${author}'`
  }

  if (keyword) {
    sql += `and title like '%${keyword}%' or content like '%${keyword}%'`
  }

  sql += 'order by createTime desc;'

  // 返回 Promise
  return exec(sql)
}

const getDetail = id => {
  const sql = `select * from blogs where id = '${id}'`
  return exec(sql).then(rows => {
    return rows[0] // 返回数组第一个元素
  })
}

const newBlog = (blogData = {}) => {
  // xss 转义特性字符，防止 xss 攻击
  let { title, content, author } = blogData

  title = xss(title)
  content = xss(content)

  const createTime = Date.now()

  const sql = `
    insert into blogs (title, content, createTime, author)
    values ('${title}', '${content}', ${createTime}, '${author}')
   `

  return exec(sql).then(insertData => {
    return { id: insertData.insertId }
  })
}

const updateBlog = (id, blogData = {}) => {
  let { title, content } = blogData

  title = xss(title)
  content = xss(content)

  const sql = `
    update blogs set title = '${title}', content = '${content}' where id = ${id}
  `

  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  const sql = `delete from blogs where id =${id} and author = '${author}'`

  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
