-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.41 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 mysns.clubs 구조 내보내기
CREATE TABLE IF NOT EXISTS `clubs` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) DEFAULT NULL,
  `group_description` varchar(255) DEFAULT NULL,
  `group_owner_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_private` varchar(100) DEFAULT 'N',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.clubs:~0 rows (대략적) 내보내기

-- 테이블 mysns.comments 구조 내보내기
CREATE TABLE IF NOT EXISTS `comments` (
  `comments_id` int NOT NULL AUTO_INCREMENT,
  `parent_comments_id` int DEFAULT NULL,
  `feed_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `comments_content` varchar(255) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` varchar(10) DEFAULT 'N',
  PRIMARY KEY (`comments_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.comments:~0 rows (대략적) 내보내기

-- 테이블 mysns.comment_likes 구조 내보내기
CREATE TABLE IF NOT EXISTS `comment_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comments_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.comment_likes:~0 rows (대략적) 내보내기

-- 테이블 mysns.feed 구조 내보내기
CREATE TABLE IF NOT EXISTS `feed` (
  `feed_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `feed_title` varchar(100) DEFAULT NULL,
  `feed_content` varchar(255) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `group_id` int DEFAULT NULL,
  `visibility` varchar(100) DEFAULT 'public',
  PRIMARY KEY (`feed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.feed:~2 rows (대략적) 내보내기
INSERT INTO `feed` (`feed_id`, `user_id`, `feed_title`, `feed_content`, `cdatetime`, `group_id`, `visibility`) VALUES
	(29, 3, '안녕하세요~', '내용입니다.', '2025-05-15 12:36:43', NULL, NULL),
	(30, 3, '2번 게시물', '2번 내용', '2025-05-15 16:08:34', NULL, NULL);

-- 테이블 mysns.feed_hashtag 구조 내보내기
CREATE TABLE IF NOT EXISTS `feed_hashtag` (
  `feed_id` int DEFAULT NULL,
  `hashtag_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.feed_hashtag:~0 rows (대략적) 내보내기

-- 테이블 mysns.follow 구조 내보내기
CREATE TABLE IF NOT EXISTS `follow` (
  `follower_id` int DEFAULT NULL,
  `following_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.follow:~1 rows (대략적) 내보내기
INSERT INTO `follow` (`follower_id`, `following_id`, `cdatetime`) VALUES
	(3, 2, '2025-05-19 09:45:28');

-- 테이블 mysns.follow_request 구조 내보내기
CREATE TABLE IF NOT EXISTS `follow_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `requester_id` int DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `status` varchar(100) DEFAULT 'pending',
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.follow_request:~0 rows (대략적) 내보내기

-- 테이블 mysns.group_member 구조 내보내기
CREATE TABLE IF NOT EXISTS `group_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.group_member:~0 rows (대략적) 내보내기

-- 테이블 mysns.group_request 구조 내보내기
CREATE TABLE IF NOT EXISTS `group_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `request_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `respond_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.group_request:~0 rows (대략적) 내보내기

-- 테이블 mysns.hashtag 구조 내보내기
CREATE TABLE IF NOT EXISTS `hashtag` (
  `hashtag_id` int NOT NULL AUTO_INCREMENT,
  `hashtag_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hashtag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.hashtag:~0 rows (대략적) 내보내기

-- 테이블 mysns.img 구조 내보내기
CREATE TABLE IF NOT EXISTS `img` (
  `img_id` int NOT NULL AUTO_INCREMENT,
  `target_id` int DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `img_name` varchar(255) DEFAULT NULL,
  `img_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`img_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.img:~32 rows (대략적) 내보내기
INSERT INTO `img` (`img_id`, `target_id`, `type`, `img_name`, `img_path`) VALUES
	(7, 15, 'feed', '1747101657658-ulsan4.jpg', 'uploads/'),
	(8, 15, 'feed', '1747101657660-gangnam2.jpg', 'uploads/'),
	(9, 15, 'feed', '1747101657662-jeju5.jpg', 'uploads/'),
	(10, 19, 'feed', '1747108679910-tour15.jpeg', 'uploads/'),
	(11, 19, 'feed', '1747108679911-ulsan4.jpg', 'uploads/'),
	(12, 21, 'feed', '1747120593706-gangnam2.jpg', 'uploads/'),
	(13, 21, 'feed', '1747120593709-jeju5.jpg', 'uploads/'),
	(14, 22, 'feed', '1747120613173-jeju5.jpg', 'uploads/'),
	(15, 22, 'feed', '1747120613173-tour9.jpg', 'uploads/'),
	(16, 23, 'feed', '1747120676146-jeju1.jpg', 'uploads/'),
	(17, 23, 'feed', '1747120676148-jeju4.jpg', 'uploads/'),
	(18, 24, 'feed', '1747121841930-tour15.jpeg', 'uploads/'),
	(19, 24, 'feed', '1747121841930-ulsan4.jpg', 'uploads/'),
	(20, 25, 'feed', '1747121985320-tour15.jpeg', 'uploads/'),
	(21, 25, 'feed', '1747121985320-ulsan4.jpg', 'uploads/'),
	(22, 25, 'feed', '1747121985320-gangnam2.jpg', 'uploads/'),
	(23, 26, 'feed', '1747122109574-tour15.jpeg', 'uploads/'),
	(24, 26, 'feed', '1747122109574-ulsan4.jpg', 'uploads/'),
	(25, 26, 'feed', '1747122109574-gangnam2.jpg', 'uploads/'),
	(26, 26, 'feed', '1747122109577-jeju5.jpg', 'uploads/'),
	(27, 27, 'feed', '1747122243529-jeju5.jpg', 'uploads/'),
	(28, 27, 'feed', '1747122243529-tour9.jpg', 'uploads/'),
	(29, 27, 'feed', '1747122243531-gangnam3.jpg', 'uploads/'),
	(30, 28, 'feed', '1747123011016-tour9.jpg', 'uploads/'),
	(31, 28, 'feed', '1747123011017-gangnam3.jpg', 'uploads/'),
	(32, 28, 'feed', '1747123011018-jeju1.jpg', 'uploads/'),
	(33, 2, 'user', '1747274628323-ulsan4.jpg', 'uploads/'),
	(34, 3, 'user', '1747275430709-banner3.jpg', 'uploads/'),
	(35, 29, 'feed', '1747280204376-banner3.jpg', 'uploads/'),
	(36, 29, 'feed', '1747280204378-banner2.jpg', 'uploads/'),
	(37, 29, 'feed', '1747280204381-banner.jpg', 'uploads/'),
	(38, 30, 'feed', '1747292916039-2025íëë 1íê¸° ê³µíëíì ì ìì íìí ë° ìì°í ì ê¸°ì´í ì¬ì§(2025.03.27.ëª©).jpg', 'uploads/');

-- 테이블 mysns.likes 구조 내보내기
CREATE TABLE IF NOT EXISTS `likes` (
  `likes_id` int NOT NULL AUTO_INCREMENT,
  `feed_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`likes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.likes:~0 rows (대략적) 내보내기

-- 테이블 mysns.notification 구조 내보내기
CREATE TABLE IF NOT EXISTS `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `feed_id` int DEFAULT NULL,
  `actor_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` varchar(100) DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.notification:~0 rows (대략적) 내보내기

-- 테이블 mysns.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_nickname` varchar(100) DEFAULT NULL,
  `intro` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 mysns.users:~2 rows (대략적) 내보내기
INSERT INTO `users` (`user_id`, `user_email`, `password`, `user_nickname`, `intro`) VALUES
	(2, 'k@naver.com', '$2b$10$yfSM2kFRurwJwQLXIMdIDezqvjhjsY1Sf3F4/K1vbo/mBHolFws42', '강재', NULL),
	(3, 'j@naver.com', '$2b$10$M3nZ/ZYjdlxieu/2RnjrdukK3848hTr9fr7dMzLFrS.VEoDO3O3tm', '재돌', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
