const User = require("../schema/user.schema");
const Post = require("../schema/post.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
const totalUsers=await User.count()

   let {limit,page}=req.query

   console.log(req.query,totalUsers,page,limit)
   const totalDocs = totalUsers; // Total number of documents
   const perPage = limit ?parseInt(limit): 10;   // Number of documents per page
   const currentPage =page ?parseInt(page): 1; // Current page
   
   // Calculate total pages
   const totalPages = Math.ceil(totalDocs / perPage);
   
   // Calculate paging counter
   const pagingCounter = (currentPage - 1) * perPage + 1;
   
   // Determine if there is a previous page
   const hasPrevPage = currentPage > 1;
   
   // Determine if there is a next page
   const hasNextPage = currentPage < totalPages;
   
   // Calculate the previous page number
   const prevPage = hasPrevPage ? currentPage - 1 : null;
   
   // Calculate the next page number
   const nextPage = hasNextPage ? currentPage + 1 : null;

    const users = await User.find({})
    .skip((currentPage - 1) * perPage)
    .limit(perPage).exec()

    if (users.length > perPage) {
      users.pop();
  }  

const results = [];
for (const user of users) {
    const postCount = await Post.countDocuments({ userId: user._id });
    results.push({
        _id: user?._id,
        name: user?.name,
        posts: postCount,
    });
}

   return res.status(200).json({
      data:{
        users: results,
        pagination:{
          "totalDocs": totalDocs,
          "limit": perPage,
          "page":currentPage,
          "totalPages": totalPages,
          "pagingCounter": pagingCounter,
          "hasPrevPage": hasPrevPage,
          "hasNextPage": hasNextPage,
          "prevPage": prevPage,
          "nextPage": nextPage
        }
      }
    });
  } catch (error) {
    console.log(error)
    res.send({ error: error.message });
  }
};
