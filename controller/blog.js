const { exec } = require('../db/mysql')
const xss = require('xss')

// 使用 async / await 语法
const getList = async (author, keyword) => {
  let sql = 'select * from blogs where 1 = 1 ' // where 1 = 1 占位

  if (author) {
    sql += `and author = '${author}'`
  }

  if (keyword) {
    sql += `and (title like '%${keyword}%' or content like '%${keyword}%')`
  }

  sql += 'order by createTime desc;'

  // 返回 Promise
  return await exec(sql)
}

const getDetail = async id => {
  const sql = `select * from blogs where id = '${id}'`
  const rows = await exec(sql)
  return rows[0]
}

const newBlog = async (blogData = {}) => {
  // xss 转义特性字符，防止 xss 攻击
  let { title, content, author } = blogData

  title = xss(title)
  content = xss(content)

  const createTime = Date.now()

  const sql = `
    insert into blogs (title, content, createTime, author)
    values ('${title}', '${content}', ${createTime}, '${author}')
   `

  const insertData = await exec(sql)
  return { id: insertData.insertId }
}

const updateBlog = async (id, blogData = {}) => {
  let { title, content } = blogData

  title = xss(title)
  content = xss(content)

  const sql = `
    update blogs set title = '${title}', content = '${content}' where id = ${id}
  `
  const updateData = await exec(sql)

  return updateBlog.affectedRows > 0 ? true : false
}

const delBlog = async (id, author) => {
  const sql = `delete from blogs where id =${id} and author = '${author}'`

  const delData = await exec(sql)

  return delData.affectedRows > 0 ? true : false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
