CREATE TABLE `equation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_t` datetime NOT NULL,
  `image_name` varchar(255) NOT NULL,
  `latex` varchar(255) NOT NULL,
  `verified` bit(1) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `modify_t` datetime DEFAULT NULL,
  `version` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_name` (`file_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;